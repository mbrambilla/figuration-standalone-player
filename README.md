# Standalone CAST Figuration Player

A quickly thrown together, simplified version of the [CAST Figuration Player](https://figuration.org/4.4/widgets/player/) that does not require the entire Figuration codebase.

Currently only supports the basic audio player layout and transcript functionality being migrated from the AEM site.

The buttons and range input use the Figuration classes, but the CSS classes have been nested to reduce style conflict.  Depending on the base CSS for the site, there could still be conflicts.

Files to be used can be found in the `dist` folder. The CSS and JS are available in either minified or unminified versions.  If using the minified versions, the file list would be:
- `figuration-player.min.css`
- `figuration-player.min.js`
- `fontello.ttf`
- `fontello.woff2`
