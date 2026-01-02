'use client';

import { useState, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  ImageIcon,
  Upload,
  X,
  Star,
  GripVertical,
  Link as LinkIcon,
  Loader2,
} from 'lucide-react';
import { supabase } from '@/lib/supabase/client';
import { PlaceImage } from '@/lib/supabase/types';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  rectSortingStrategy,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

interface ImageUploadProps {
  images: PlaceImage[];
  onImagesChange: (images: PlaceImage[]) => void;
  placeId?: string;
}

interface SortableImageProps {
  image: PlaceImage;
  onRemove: () => void;
  onSetThumbnail: () => void;
}

function SortableImage({ image, onRemove, onSetThumbnail }: SortableImageProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: image.id || image.url });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="relative group aspect-square bg-gray-100 rounded-lg overflow-hidden"
    >
      <img
        src={image.url}
        alt={image.alt || ''}
        className="w-full h-full object-cover"
      />

      {/* Drag handle */}
      <div
        {...attributes}
        {...listeners}
        className="absolute top-1 left-1 p-1 bg-black/50 rounded cursor-grab opacity-0 group-hover:opacity-100 transition-opacity"
      >
        <GripVertical className="h-4 w-4 text-white" />
      </div>

      {/* Thumbnail badge */}
      {image.is_thumbnail && (
        <div className="absolute top-1 right-1 bg-yellow-500 text-white text-xs px-1.5 py-0.5 rounded flex items-center gap-1">
          <Star className="h-3 w-3 fill-current" />
          대표
        </div>
      )}

      {/* Actions overlay */}
      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100">
        {!image.is_thumbnail && (
          <Button
            type="button"
            size="sm"
            variant="secondary"
            onClick={onSetThumbnail}
            className="h-8"
          >
            <Star className="h-3 w-3 mr-1" />
            대표로
          </Button>
        )}
        <Button
          type="button"
          size="sm"
          variant="destructive"
          onClick={onRemove}
          className="h-8"
        >
          <X className="h-3 w-3" />
        </Button>
      </div>
    </div>
  );
}

export function ImageUpload({ images, onImagesChange, placeId }: ImageUploadProps) {
  const [urlInput, setUrlInput] = useState('');
  const [uploading, setUploading] = useState(false);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      const oldIndex = images.findIndex(
        (img) => (img.id || img.url) === active.id
      );
      const newIndex = images.findIndex(
        (img) => (img.id || img.url) === over.id
      );

      onImagesChange(arrayMove(images, oldIndex, newIndex));
    }
  };

  const addImageByUrl = () => {
    if (!urlInput.trim()) return;

    const newImage: PlaceImage = {
      id: `temp-${Date.now()}`,
      created_at: new Date().toISOString(),
      place_id: placeId || '',
      url: urlInput.trim(),
      alt: null,
      sort_order: images.length,
      is_thumbnail: images.length === 0,
    };

    onImagesChange([...images, newImage]);
    setUrlInput('');
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setUploading(true);

    try {
      const newImages: PlaceImage[] = [];

      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const fileExt = file.name.split('.').pop();
        const fileName = `${Date.now()}-${i}.${fileExt}`;
        const filePath = `places/${placeId || 'temp'}/${fileName}`;

        const { data, error } = await supabase.storage
          .from('place-images')
          .upload(filePath, file);

        if (error) {
          console.error('Upload error:', error);
          continue;
        }

        const { data: urlData } = supabase.storage
          .from('place-images')
          .getPublicUrl(filePath);

        newImages.push({
          id: `temp-${Date.now()}-${i}`,
          created_at: new Date().toISOString(),
          place_id: placeId || '',
          url: urlData.publicUrl,
          alt: file.name,
          sort_order: images.length + i,
          is_thumbnail: images.length === 0 && i === 0,
        });
      }

      onImagesChange([...images, ...newImages]);
    } catch (err) {
      console.error('Upload failed:', err);
      alert('이미지 업로드에 실패했습니다.');
    } finally {
      setUploading(false);
      e.target.value = '';
    }
  };

  const removeImage = (index: number) => {
    const newImages = images.filter((_, i) => i !== index);
    // If we removed the thumbnail, make the first image the new thumbnail
    if (images[index].is_thumbnail && newImages.length > 0) {
      newImages[0] = { ...newImages[0], is_thumbnail: true };
    }
    onImagesChange(newImages);
  };

  const setThumbnail = (index: number) => {
    const newImages = images.map((img, i) => ({
      ...img,
      is_thumbnail: i === index,
    }));
    onImagesChange(newImages);
  };

  return (
    <div className="space-y-4">
      {/* Image grid */}
      {images.length > 0 ? (
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
        >
          <SortableContext
            items={images.map((img) => img.id || img.url)}
            strategy={rectSortingStrategy}
          >
            <div className="grid grid-cols-2 gap-2">
              {images.map((image, index) => (
                <SortableImage
                  key={image.id || image.url}
                  image={image}
                  onRemove={() => removeImage(index)}
                  onSetThumbnail={() => setThumbnail(index)}
                />
              ))}
            </div>
          </SortableContext>
        </DndContext>
      ) : (
        <div className="border-2 border-dashed border-gray-200 rounded-lg p-8 text-center">
          <ImageIcon className="h-8 w-8 text-gray-400 mx-auto mb-2" />
          <p className="text-sm text-gray-500">이미지가 없습니다</p>
        </div>
      )}

      {/* URL input */}
      <div className="space-y-2">
        <Label className="text-xs text-gray-500">URL로 추가</Label>
        <div className="flex gap-2">
          <Input
            type="url"
            value={urlInput}
            onChange={(e) => setUrlInput(e.target.value)}
            placeholder="https://..."
            className="text-sm"
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault();
                addImageByUrl();
              }
            }}
          />
          <Button
            type="button"
            variant="outline"
            size="icon"
            onClick={addImageByUrl}
          >
            <LinkIcon className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* File upload */}
      <div className="space-y-2">
        <Label className="text-xs text-gray-500">파일 업로드</Label>
        <div className="relative">
          <input
            type="file"
            accept="image/*"
            multiple
            onChange={handleFileUpload}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            disabled={uploading}
          />
          <Button
            type="button"
            variant="outline"
            className="w-full gap-2"
            disabled={uploading}
          >
            {uploading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Upload className="h-4 w-4" />
            )}
            {uploading ? '업로드 중...' : '이미지 선택'}
          </Button>
        </div>
        <p className="text-xs text-gray-500">
          여러 이미지를 선택할 수 있습니다. 드래그하여 순서를 변경하세요.
        </p>
      </div>
    </div>
  );
}
