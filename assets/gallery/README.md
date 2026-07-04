# Gallery assets

Drop your photography and videography files here. The page references these exact
names, so matching them makes your work appear automatically (no code changes needed).
Until a file exists, its tile shows a styled gold placeholder.

## Photography (6 tiles)
- `photo-1.jpg` … `photo-6.jpg`  — any aspect ratio; tiles crop to 4:3.
  Recommended: ~1600px on the long edge, optimized JPG/WebP (< ~400 KB each).

## Videography (2 cards)
- `video-1.jpg`, `video-2.jpg`  — thumbnail stills (16:9 looks best).

To link the videos: open `index.html`, find the `.video-card` anchors in the
`#gallery` section, and set `href="..."` to your YouTube/Vimeo/file URL. Also update
each card's `<h4>` title and `<p>` description.

## To add/remove tiles
Duplicate or delete a `.gallery-item` (photos) or `.video-card` (videos) block in
`index.html`. To rename captions, edit each tile's `data-caption` and the
`<span class="gallery-caption">` text.

Tip: keep filenames lowercase with no spaces.
