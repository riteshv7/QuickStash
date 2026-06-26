import zlib
import struct
import os
import math

def write_png(buf, width, height, filename):
    raw_data = b""
    for y in range(height):
        raw_data += b"\x00"  # Filter type 0 (None)
        raw_data += buf[y * width * 4 : (y + 1) * width * 4]
    
    # PNG Signature
    png = b"\x89PNG\r\n\x1a\n"
    
    # IHDR Chunk
    ihdr_data = struct.pack(">IIBBBBB", width, height, 8, 6, 0, 0, 0)
    png += struct.pack(">I", 13) + b"IHDR" + ihdr_data + struct.pack(">I", zlib.crc32(b"IHDR" + ihdr_data))
    
    # IDAT Chunk
    idat_data = zlib.compress(raw_data)
    png += struct.pack(">I", len(idat_data)) + b"IDAT" + idat_data + struct.pack(">I", zlib.crc32(b"IDAT" + idat_data))
    
    # IEND Chunk
    png += struct.pack(">I", 0) + b"IEND" + struct.pack(">I", zlib.crc32(b"IEND"))
    
    os.makedirs(os.path.dirname(filename), exist_ok=True)
    with open(filename, "wb") as f:
        f.write(png)

def draw_icon(size, filename):
    buf = bytearray(size * size * 4)
    r = size * 0.22  # Corner radius
    cx_vals = [r, size - r]
    cy_vals = [r, size - r]
    
    for y in range(size):
        for x in range(size):
            idx = (y * size + x) * 4
            
            # Rounded corner calculation
            in_corner = False
            dx = dy = 0
            if x < r and y < r:
                in_corner, dx, dy = True, r - x, r - y
            elif x > size - r and y < r:
                in_corner, dx, dy = True, x - (size - r), r - y
            elif x < r and y > size - r:
                in_corner, dx, dy = True, r - x, y - (size - r)
            elif x > size - r and y > size - r:
                in_corner, dx, dy = True, x - (size - r), y - (size - r)
            
            if in_corner:
                dist = math.sqrt(dx*dx + dy*dy)
                if dist > r:
                    # Outside the rounded corner
                    buf[idx:idx+4] = (0, 0, 0, 0)
                    continue
                elif dist > r - 1.0:
                    # Simple anti-aliasing edge
                    alpha = int((1.0 - (dist - (r - 1.0))) * 255)
                    alpha = max(0, min(255, alpha))
                else:
                    alpha = 255
            else:
                alpha = 255
            
            # Draw a beautiful gradient: deep violet to teal
            # Violet: (110, 68, 255) -> Teal/Cyan: (0, 229, 255)
            ratio = (x + y) / (size * 2.0)
            red = int(110 + (0 - 110) * ratio)
            green = int(68 + (229 - 68) * ratio)
            blue = int(255 + (255 - 255) * ratio)
            
            # Draw a stylized "Q" shape in the middle (white with glow)
            # Outer circle of Q
            cx, cy = size / 2.0, size / 2.0
            rad_outer = size * 0.25
            rad_inner = size * 0.15
            dist_to_center = math.sqrt((x - cx)**2 + (y - cy)**2)
            
            # Tail of the "Q"
            in_tail = False
            # Tail is a diagonal line from center to bottom-right
            if size * 0.1 < (x - cx) < size * 0.3 and size * 0.1 < (y - cy) < size * 0.3:
                # Check if it lies along the diagonal x - cx == y - cy
                diag_dist = abs((x - cx) - (y - cy))
                if diag_dist < size * 0.05:
                    in_tail = True
            
            if (rad_inner <= dist_to_center <= rad_outer) or in_tail:
                # Draw white symbol
                buf[idx] = 255
                buf[idx+1] = 255
                buf[idx+2] = 255
                buf[idx+3] = alpha
            else:
                # Draw background gradient
                buf[idx] = red
                buf[idx+1] = green
                buf[idx+2] = blue
                buf[idx+3] = alpha
                
    write_png(bytes(buf), size, size, filename)

if __name__ == "__main__":
    draw_icon(16, "icons/icon16.png")
    draw_icon(48, "icons/icon48.png")
    draw_icon(128, "icons/icon128.png")
    print("Icons generated successfully!")
