'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { X, Save, Loader2, Lock, Check, AlertTriangle } from 'lucide-react';

interface SaveItineraryModalProps {
  onClose: () => void;
  onSave: (password: string, description: string) => Promise<boolean>;
  title: string;
  isUpdate?: boolean;
}

export function SaveItineraryModal({
  onClose,
  onSave,
  title,
  isUpdate = false,
}: SaveItineraryModalProps) {
  const [password, setPassword] = useState('');
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!password) {
      setError('비밀번호를 입력해주세요');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const result = await onSave(password, description);
      if (result) {
        setSuccess(true);
        setTimeout(() => {
          onClose();
        }, 1500);
      } else {
        setError('저장에 실패했습니다');
      }
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('저장 중 오류가 발생했습니다');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
      <div className="bg-white rounded-2xl w-full max-w-md overflow-hidden shadow-xl">
        {/* Header */}
        <div className="p-4 border-b border-gray-200 flex items-center justify-between">
          <h3 className="text-xl font-bold text-gray-800">
            {isUpdate ? '일정 수정' : '일정 저장'}
          </h3>
          <button
            onClick={onClose}
            className="p-2 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <form onSubmit={handleSubmit} className="p-6">
          {success ? (
            <div className="text-center py-8">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-green-100 flex items-center justify-center">
                <Check className="w-8 h-8 text-green-600" />
              </div>
              <h4 className="text-lg font-semibold text-gray-800 mb-2">
                {isUpdate ? '일정이 수정되었습니다!' : '일정이 저장되었습니다!'}
              </h4>
              <p className="text-gray-600">
                일정 목록에서 확인할 수 있습니다.
              </p>
            </div>
          ) : (
            <>
              {/* Title Display */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  일정 제목
                </label>
                <div className="px-4 py-3 bg-gray-100 rounded-xl text-gray-800 font-medium">
                  {title}
                </div>
              </div>

              {/* Description */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  설명 (선택사항)
                </label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-ocean-500 focus:ring-2 focus:ring-ocean-500/20 outline-none resize-none"
                  rows={3}
                  placeholder="예: 가족 여행 일정, 허니문 계획 등"
                />
              </div>

              {/* Password */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  <Lock className="w-4 h-4 inline mr-1" />
                  관리자 비밀번호
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-ocean-500 focus:ring-2 focus:ring-ocean-500/20 outline-none"
                  placeholder="비밀번호를 입력하세요"
                  autoComplete="off"
                />
                <p className="text-xs text-gray-500 mt-1">
                  저장/수정/삭제에 필요한 비밀번호입니다
                </p>
              </div>

              {/* Error Message */}
              {error && (
                <div className="mb-4 p-3 bg-red-50 rounded-xl flex items-center gap-2 text-red-700">
                  <AlertTriangle className="w-4 h-4 flex-shrink-0" />
                  <span className="text-sm">{error}</span>
                </div>
              )}

              {/* Buttons */}
              <div className="flex gap-3">
                <Button
                  type="button"
                  variant="outline"
                  className="flex-1"
                  onClick={onClose}
                  disabled={loading}
                >
                  취소
                </Button>
                <Button
                  type="submit"
                  variant="ocean"
                  className="flex-1"
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      저장 중...
                    </>
                  ) : (
                    <>
                      <Save className="w-4 h-4 mr-2" />
                      {isUpdate ? '수정하기' : '저장하기'}
                    </>
                  )}
                </Button>
              </div>
            </>
          )}
        </form>
      </div>
    </div>
  );
}

export default SaveItineraryModal;
