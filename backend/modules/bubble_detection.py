import cv2
import numpy as np

def detect_bubbles(img_path):
    img = cv2.imread(img_path)

    if img is None:
        print("Image Status: Not Found")
        return [], None

    print("Image Status: OK")

    # تكبير الصورة لو صغيرة عشان الـ OCR يشتغل أحسن
    scale = 1.0
    if img.shape[1] < 800:
        scale = 800 / img.shape[1]
        img = cv2.resize(img, None, fx=scale, fy=scale)

    gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)

    # تحسين التباين
    gray = cv2.equalizeHist(gray)

    # threshold تكيفي بجانب الـ binary العادي
    _, thresh_binary = cv2.threshold(gray, 200, 255, cv2.THRESH_BINARY)
    thresh_adapt = cv2.adaptiveThreshold(gray, 255,
                    cv2.ADAPTIVE_THRESH_GAUSSIAN_C,
                    cv2.THRESH_BINARY, 21, 5)

    # دمج الاتنين
    thresh = cv2.bitwise_and(thresh_binary, thresh_adapt)

    # تنظيف الضوضاء
    kernel = np.ones((3, 3), np.uint8)
    thresh = cv2.morphologyEx(thresh, cv2.MORPH_CLOSE, kernel, iterations=2)
    thresh = cv2.morphologyEx(thresh, cv2.MORPH_OPEN, kernel, iterations=1)

    contours, _ = cv2.findContours(thresh, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)

    img_h, img_w = img.shape[:2]
    total_area = img_h * img_w

    bubbles = []
    for cnt in contours:
        area = cv2.contourArea(cnt)
        x, y, w, h = cv2.boundingRect(cnt)

        # مساحة معقولة (مش صغيرة أوي أو أكبر من 15% من الصورة)
        if area < 1000 or area > total_area * 0.15:
            continue

        # نسبة العرض للطول
        aspect_ratio = w / h
        if aspect_ratio < 0.2 or aspect_ratio > 5:
            continue

        # fill ratio
        fill_ratio = area / (w * h)
        if fill_ratio < 0.4:
            continue

        # الجزء الداخلي أبيض
        roi = gray[y:y+h, x:x+w]
        white_ratio = np.sum(roi > 180) / roi.size
        if white_ratio < 0.55:
            continue

        # circularity
        perimeter = cv2.arcLength(cnt, True)
        if perimeter == 0:
            continue
        circularity = 4 * np.pi * area / (perimeter ** 2)
        if circularity < 0.2:
            continue

        # مش على حافة الصورة (غالباً مش فقاعة)
        margin = 5
        if x < margin or y < margin or (x+w) > img_w-margin or (y+h) > img_h-margin:
            continue

        bubbles.append((x, y, w, h, cnt))

    # إزالة الفقاعات المتداخلة (لو فقاعة جوه فقاعة)
    filtered = []
    for i, (x1, y1, w1, h1, cnt1) in enumerate(bubbles):
        inside = False
        for j, (x2, y2, w2, h2, cnt2) in enumerate(bubbles):
            if i == j:
                continue
            if x1 > x2 and y1 > y2 and (x1+w1) < (x2+w2) and (y1+h1) < (y2+h2):
                inside = True
                break
        if not inside:
            filtered.append((x1, y1, w1, h1, cnt1))

    print(f"عدد الفقاعات: {len(filtered)}")

    img_debug = img.copy()
    for (x, y, w, h, cnt) in filtered:
        print(f"Bubble: x={x}, y={y}, w={w}, h={h}")
        cv2.drawContours(img_debug, [cnt], -1, (0, 0, 255), 2)

    cv2.imshow('Bubble Detection', img_debug)
    cv2.waitKey(0)
    cv2.destroyAllWindows()

    return filtered, img


# تشغيل
img_path = r'C:\Users\windows\OneDrive\Desktop\manga.jpg'
detect_bubbles(img_path) 
