"""
Arabic Text Rendering Module
=============================
Task 5 - AI-Powered Manga Translator Project
Team: VisionFlow | Delta University for Science and Technology

Responsibilities:
- Accept PIL/OpenCV image + bounding box + Arabic text
- Reshape Arabic characters correctly (arabic_reshaper)
- Apply RTL direction (python-bidi)
- Auto-fit font size inside bubble
- Wrap text into multiple lines
- Center text horizontally and vertically
- Return modified image
"""

import os
import numpy as np
from PIL import Image, ImageDraw, ImageFont
import arabic_reshaper
from bidi.algorithm import get_display


# ============================================================
# FONT LOADER
# ============================================================

def load_font(font_size: int, font_path: str = None) -> ImageFont.FreeTypeFont:
    """
    Load an Arabic-compatible font at the given size.
    Tries the provided path first, then common system paths.

    Args:
        font_size: Font size in points.
        font_path: Optional path to a .ttf font file.

    Returns:
        PIL ImageFont object.
    """
    candidates = []

    if font_path:
        candidates.append(font_path)

    # Common system Arabic fonts across platforms
    candidates += [
        # Linux
        "/usr/share/fonts/truetype/arabic/NotoSansArabic-Regular.ttf",
        "/usr/share/fonts/truetype/noto/NotoSansArabic-Regular.ttf",
        "/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf",
        # macOS
        "/System/Library/Fonts/Geeza Pro.ttf",
        "/Library/Fonts/Arial Unicode.ttf",
        # Windows
        "C:/Windows/Fonts/arial.ttf",
        "C:/Windows/Fonts/times.ttf",
    ]

    for path in candidates:
        if path and os.path.exists(path):
            try:
                return ImageFont.truetype(path, font_size)
            except Exception:
                continue

    # Absolute fallback (no Arabic shaping but won't crash)
    return ImageFont.load_default()


# ============================================================
# ARABIC TEXT PREPARATION
# ============================================================

def prepare_arabic(text: str) -> str:
    """
    Prepare Arabic text for correct rendering inside PIL:
    1. arabic_reshaper  → connects and shapes Arabic letters properly
    2. get_display      → applies Bidi algorithm for RTL direction

    Args:
        text: Raw Arabic string.

    Returns:
        Reshaped and bidi-processed string ready for PIL.
    """
    reshaped = arabic_reshaper.reshape(text)
    bidi_text = get_display(reshaped)
    return bidi_text


# ============================================================
# TEXT WRAPPING
# ============================================================

def wrap_text(text: str, font: ImageFont.FreeTypeFont,
              max_width: int, draw: ImageDraw.ImageDraw) -> list:
    """
    Wrap Arabic text into lines that fit within max_width pixels.

    Splits by words and builds lines greedily.
    Falls back to character-level splitting for very long words.

    Args:
        text:      The display-ready Arabic string (already bidi'd).
        font:      PIL font to measure text width.
        max_width: Maximum allowed pixel width per line.
        draw:      PIL ImageDraw used for text measurement.

    Returns:
        List of strings, each fitting within max_width.
    """
    words = text.split()
    lines = []
    current_line = ""

    for word in words:
        test = (word + " " + current_line).strip()
        bbox = draw.textbbox((0, 0), test, font=font)
        line_width = bbox[2] - bbox[0]

        if line_width <= max_width:
            current_line = test
        else:
            if current_line:
                lines.append(current_line.strip())
            # Check if the word alone fits; if not, force-split
            word_bbox = draw.textbbox((0, 0), word, font=font)
            if word_bbox[2] - word_bbox[0] <= max_width:
                current_line = word
            else:
                # Force character-level split for oversized words
                chars = list(word)
                chunk = ""
                for ch in chars:
                    test_chunk = chunk + ch
                    cb = draw.textbbox((0, 0), test_chunk, font=font)
                    if cb[2] - cb[0] <= max_width:
                        chunk = test_chunk
                    else:
                        if chunk:
                            lines.append(chunk)
                        chunk = ch
                current_line = chunk

    if current_line.strip():
        lines.append(current_line.strip())

    return lines


# ============================================================
# FONT SIZE AUTO-FITTER
# ============================================================

def find_best_font_size(prepared_text: str, bubble_w: int, bubble_h: int,
                        draw: ImageDraw.ImageDraw, font_path: str = None,
                        max_size: int = 32, min_size: int = 7,
                        padding: int = 10) -> tuple:
    """
    Find the largest font size where all wrapped lines fit inside the bubble.

    Args:
        prepared_text: Bidi-ready Arabic text.
        bubble_w:      Bubble width in pixels.
        bubble_h:      Bubble height in pixels.
        draw:          PIL ImageDraw for measurement.
        font_path:     Optional font path.
        max_size:      Start trying from this size downward.
        min_size:      Minimum allowed font size.
        padding:       Inner padding (pixels) on each side.

    Returns:
        (font, lines, font_size) — best fitting combination.
    """
    available_w = bubble_w - padding * 2
    available_h = bubble_h - padding * 2

    for size in range(max_size, min_size - 1, -1):
        font = load_font(size, font_path)
        lines = wrap_text(prepared_text, font, available_w, draw)

        # Measure total block height
        total_h = 0
        max_line_w = 0
        line_spacing = max(3, size // 6)

        for line in lines:
            bbox = draw.textbbox((0, 0), line, font=font)
            lh = bbox[3] - bbox[1]
            lw = bbox[2] - bbox[0]
            total_h += lh + line_spacing
            max_line_w = max(max_line_w, lw)

        total_h -= line_spacing  # remove trailing spacing

        if total_h <= available_h and max_line_w <= available_w:
            return font, lines, size

    # Return minimum size as last resort
    font = load_font(min_size, font_path)
    lines = wrap_text(prepared_text, font, available_w, draw)
    return font, lines, min_size


# ============================================================
# WHITEOUT BUBBLE
# ============================================================

def whiteout_bubble(draw: ImageDraw.ImageDraw, x: int, y: int,
                    w: int, h: int, padding: int = 4) -> None:
    """
    Paint the interior of the bubble white to erase original text.

    Args:
        draw:    PIL ImageDraw object.
        x, y:   Top-left corner of the bounding box.
        w, h:   Width and height of the bounding box.
        padding: Shrink inward to avoid erasing bubble border.
    """
    draw.rectangle(
        [x + padding, y + padding, x + w - padding, y + h - padding],
        fill=(255, 255, 255)
    )


# ============================================================
# MAIN RENDERING FUNCTION
# ============================================================

def render_arabic_text(
    image,
    bbox: tuple,
    arabic_text: str,
    font_path: str = None,
    text_color: tuple = (15, 15, 15),
    padding: int = 10
):
    """
    Render Arabic text inside a detected manga speech bubble.

    Pipeline:
        1. Convert image to PIL if needed (accepts OpenCV ndarray)
        2. Whiteout the bubble interior
        3. Prepare Arabic text (reshape + bidi)
        4. Auto-fit font size + wrap lines
        5. Center-align and draw each line
        6. Return modified PIL Image

    Args:
        image:       PIL Image or OpenCV numpy array (BGR).
        bbox:        Bounding box as (x, y, width, height).
        arabic_text: Arabic string to render.
        font_path:   Optional path to Arabic .ttf font file.
        text_color:  RGB tuple for text color. Default near-black.
        padding:     Inner padding in pixels (all sides).

    Returns:
        PIL Image with Arabic text rendered inside the bubble.

    Raises:
        ValueError: If bbox dimensions are invalid.
        TypeError:  If image type is not supported.
    """

    # --- Input validation ---
    if not arabic_text or not arabic_text.strip():
        return image if isinstance(image, Image.Image) else _cv2_to_pil(image)

    x, y, w, h = bbox
    if w <= 0 or h <= 0:
        raise ValueError(f"Invalid bounding box dimensions: w={w}, h={h}")

    # --- Convert to PIL if OpenCV ---
    if isinstance(image, np.ndarray):
        pil_image = _cv2_to_pil(image)
    elif isinstance(image, Image.Image):
        pil_image = image.copy()
    else:
        raise TypeError(f"Unsupported image type: {type(image)}")

    # Ensure RGBA or RGB
    if pil_image.mode not in ("RGB", "RGBA"):
        pil_image = pil_image.convert("RGB")

    draw = ImageDraw.Draw(pil_image)

    # --- Step 1: Whiteout original text ---
    whiteout_bubble(draw, x, y, w, h, padding=4)

    # --- Step 2: Prepare Arabic text ---
    prepared_text = prepare_arabic(arabic_text.strip())

    # --- Step 3: Find best font size and wrap lines ---
    font, lines, font_size = find_best_font_size(
        prepared_text, w, h, draw,
        font_path=font_path,
        padding=padding
    )

    if not lines:
        return pil_image

    # --- Step 4: Calculate total text block height ---
    line_spacing = max(3, font_size // 6)
    line_data = []  # (line_text, line_width, line_height)

    for line in lines:
        bbox_line = draw.textbbox((0, 0), line, font=font)
        lw = bbox_line[2] - bbox_line[0]
        lh = bbox_line[3] - bbox_line[1]
        line_data.append((line, lw, lh))

    total_text_h = sum(lh for _, _, lh in line_data) + line_spacing * (len(line_data) - 1)

    # --- Step 5: Vertical centering start Y ---
    start_y = y + (h - total_text_h) // 2

    # --- Step 6: Draw each line horizontally centered ---
    cursor_y = start_y
    for (line, lw, lh) in line_data:
        line_x = x + (w - lw) // 2  # horizontal center
        draw.text((line_x, cursor_y), line, font=font, fill=text_color)
        cursor_y += lh + line_spacing

    return pil_image


# ============================================================
# HELPER: OpenCV → PIL conversion
# ============================================================

def _cv2_to_pil(cv_image: np.ndarray) -> Image.Image:
    """Convert BGR OpenCV image to RGB PIL Image."""
    rgb = cv_image[:, :, ::-1].copy()  # BGR → RGB
    return Image.fromarray(rgb)


def pil_to_cv2(pil_image: Image.Image) -> np.ndarray:
    """Convert RGB PIL Image back to BGR OpenCV array."""
    rgb_array = np.array(pil_image)
    return rgb_array[:, :, ::-1].copy()  # RGB → BGR


# ============================================================
# QUICK TEST (run this file directly to verify)
# ============================================================

if __name__ == "__main__":
    print("=== Arabic Text Renderer - Quick Test ===\n")

    # Create a blank white test image with a mock bubble
    test_img = Image.new("RGB", (400, 300), color=(240, 240, 240))

    # Draw a mock speech bubble (white rounded rect)
    d = ImageDraw.Draw(test_img)
    d.rounded_rectangle([50, 60, 350, 200], radius=20,
                         fill="white", outline="black", width=2)

    # Test bounding box matches the bubble above
    test_bbox = (50, 60, 300, 140)  # x, y, w, h

    # Sample Arabic text to render
    sample_text = "مرحباً! كيف حالك؟ أنا بخير شكراً لك."

    print(f"Input text  : {sample_text}")
    print(f"Bounding box: {test_bbox}")

    result = render_arabic_text(
        image=test_img,
        bbox=test_bbox,
        arabic_text=sample_text,
        font_path=None  # will auto-detect system font
    )

    output_path = "test_arabic_render_output.png"
    result.save(output_path)
    print(f"\nOutput saved: {output_path}")
    print("Open the image to verify Arabic text is correctly rendered inside the bubble.")
    print("\n✓ Module loaded successfully.")
