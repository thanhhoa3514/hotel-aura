# Types Structure

Cấu trúc types được tổ chức theo modules để dễ quản lý và maintain.

## Cấu trúc thư mục

```
types/
├── common/
│   └── api.types.ts          # Generic API response wrapper
├── room/
│   └── room.types.ts          # Room, RoomType, RoomStatus, RoomImage, RoomAvailability
├── guest/
│   └── guest.types.ts         # Guest, Customer
├── reservation/
│   └── reservation.types.ts   # Reservation, ReservationStatus
├── index.ts                   # Central export point
└── api.types.ts              # DEPRECATED - kept for backward compatibility
```

## Cách sử dụng

### Import từ central export (Recommended)

```typescript
import {
  RoomResponse,
  RoomRequest,
  ApiResponse,
  GuestResponse,
  ReservationResponse,
} from "@/types";
```

### Import trực tiếp từ module cụ thể

```typescript
import { RoomResponse, RoomRequest } from "@/types/room/room.types";
import { GuestResponse } from "@/types/guest/guest.types";
```

## Types Overview

### Common Types (`common/api.types.ts`)

- `ApiResponse<T>`: Generic wrapper cho tất cả API responses

### Room Types (`room/room.types.ts`)

- `RoomResponse`: Room data từ backend
- `RoomRequest`: Request để tạo/update room
- `RoomTypeResponse`: Room type information
- `RoomStatusResponse`: Room status (AVAILABLE, OCCUPIED, MAINTENANCE, CLEANING)
- `RoomImageResponse`: Room images
- `RoomAvailabilityRequest`: Request để check room availability
- `RoomAvailabilityResponse`: Response với availability info
- `Room`: Legacy type cho admin components

### Guest Types (`guest/guest.types.ts`)

- `GuestResponse`: Guest data từ backend
- `GuestRequest`: Request để tạo guest
- `Customer`: Legacy type cho admin components

### Reservation Types (`reservation/reservation.types.ts`)

- `ReservationResponse`: Reservation data từ backend
- `ReservationRequest`: Request để tạo reservation
- `ReservationStatus`: Enum cho reservation status

## Backend Mapping

Tất cả types đều match với Java DTOs từ backend:

- `RoomResponse` ↔ `RoomResponse.java`
- `RoomRequest` ↔ `RoomRequest.java`
- `GuestResponse` ↔ `GuestResponse.java`
- `ReservationResponse` ↔ `ReservationResponse.java`

## Status Values

### Room Status

Backend sử dụng UPPERCASE enum values:

- `AVAILABLE`: Phòng trống
- `OCCUPIED`: Đã đặt
- `CLEANING`: Đang dọn
- `MAINTENANCE`: Bảo trì

### Reservation Status

- `PENDING`: Chờ xác nhận
- `CONFIRMED`: Đã xác nhận
- `CHECKED_IN`: Đã check-in
- `CHECKED_OUT`: Đã check-out
- `CANCELLED`: Đã hủy

## Migration Notes

File `api.types.ts` cũ vẫn được giữ lại để backward compatibility, nhưng nên migrate sang structure mới:

```typescript
// Old (deprecated)
import { RoomResponse } from "@/types/api.types";

// New (recommended)
import { RoomResponse } from "@/types";
```
