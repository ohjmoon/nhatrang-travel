'use client';

import Link from 'next/link';
import { usePathname, useSearchParams } from 'next/navigation';
import { cn } from '@/lib/utils';
import {
  LayoutDashboard,
  MapPin,
  UtensilsCrossed,
  Compass,
  Waves,
  ShoppingBag,
  Hotel,
} from 'lucide-react';

const navigation = [
  { name: '대시보드', href: '/admin', icon: LayoutDashboard, exact: true },
  { name: '전체 장소', href: '/admin/places', icon: MapPin, exact: true },
  { name: '숙소', href: '/admin/accommodations', icon: Hotel },
  { name: '맛집', href: '/admin/places?type=restaurant', icon: UtensilsCrossed },
  { name: '볼거리', href: '/admin/places?type=attraction', icon: Compass },
  { name: '액티비티', href: '/admin/places?type=activity', icon: Waves },
  { name: '쇼핑', href: '/admin/places?type=shopping', icon: ShoppingBag },
];

interface AdminNavProps {
  onItemClick?: () => void;
}

export default function AdminNav({ onItemClick }: AdminNavProps) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const currentType = searchParams.get('type');

  return (
    <nav className="p-4 space-y-1">
      {navigation.map((item) => {
        // Parse the href to check for query params
        const [itemPath, itemQuery] = item.href.split('?');
        const itemType = itemQuery?.split('=')[1];

        let isActive = false;
        if (item.exact) {
          // Exact match for dashboard and "전체 장소"
          isActive = pathname === itemPath && !currentType;
        } else if (itemType) {
          // Match by type query param
          isActive = pathname === itemPath && currentType === itemType;
        } else {
          // Default: starts with path
          isActive = pathname.startsWith(itemPath);
        }
        return (
          <Link
            key={item.name}
            href={item.href}
            className={cn(
              'flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors',
              isActive
                ? 'bg-primary text-primary-foreground'
                : 'text-gray-700 hover:bg-gray-100'
            )}
            onClick={onItemClick}
          >
            <item.icon className="h-5 w-5" />
            {item.name}
          </Link>
        );
      })}
    </nav>
  );
}
