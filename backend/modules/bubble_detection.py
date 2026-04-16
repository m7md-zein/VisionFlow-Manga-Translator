import cv2
import numpy as np
from PIL import Image, ImageDraw, ImageFont
from arabic_reshaper import reshape
from bidi.algorithm import get_display

img_path = r'C:\Users\windows\OneDrive\Desktop\manga.jpg'
img = cv2.imread(img_path)

if img is None:
    print("Image Status: Not Found")
else:
    print("Image Status: OK")

    gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
    _, thresh = cv2.threshold(gray, 200, 255, cv2.THRESH_BINARY)
    contours, _ = cv2.findContours(thresh, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)

    bubbles = []
    for cnt in contours:
        area = cv2.contourArea(cnt)
        x, y, w, h = cv2.boundingRect(cnt)

        if area < 2000 or area > 80000:
            continue

        aspect_ratio = w / h
        if aspect_ratio < 0.3 or aspect_ratio > 4:
            continue

        fill_ratio = area / (w * h)
        if fill_ratio < 0.5:
            continue

        roi = gray[y:y+h, x:x+w]
        white_ratio = np.sum(roi > 200) / roi.size
        if white_ratio < 0.7:
            continue

        perimeter = cv2.arcLength(cnt, True)
        if perimeter == 0:
            continue
        circularity = 4 * np.pi * area / (perimeter ** 2)
        if circularity < 0.4:
            continue

        bubbles.append((x, y, w, h))

    print(f"عدد الفقاعات: {len(bubbles)}")

    img_debug = img.copy()
    for (x, y, w, h) in bubbles:
        print(f"Bubble: x={x}, y={y}, w={w}, h={h}")
        cv2.rectangle(img_debug, (x, y), (x+w, y+h), (0, 0, 255), 2)

    cv2.imshow('Bubble Detection', img_debug)
    cv2.waitKey(0)
    cv2.destroyAllWindows()