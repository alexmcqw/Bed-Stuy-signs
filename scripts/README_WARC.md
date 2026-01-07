# Creating a WARC Archive of the Website

This directory contains scripts to create an archivable WARC (Web ARChive) version of the Bed-Stuy Signs website.

## Option 1: Using warcit (Python) - Recommended

1. Install warcit:
   ```bash
   pip install warcit
   ```

2. Run the script:
   ```bash
   python scripts/create_warc.py
   ```

   This will create `bed-stuy-signs-archive.warc.gz` in the current directory.

## Option 2: Using wget

1. Install wget (if not already installed):
   ```bash
   brew install wget
   ```

2. Run:
   ```bash
   wget --mirror \
        --warc-file=bed-stuy-signs-archive \
        --warc-cdx \
        --page-requisites \
        --adjust-extension \
        --convert-links \
        --no-parent \
        https://alexmcqw.github.io/Bed-Stuy-signs/
   ```

## Option 3: Using WARCreate Chrome Extension

1. Install the [WARCreate Chrome extension](https://warcreate.com/)
2. Navigate to your website: https://alexmcqw.github.io/Bed-Stuy-signs/
3. Click the extension icon and select "Generate WARC"
4. The WARC file will be downloaded

## Viewing the Archive

You can view the archived website using:
- **ReplayWeb.page**: Upload your WARC file to https://replayweb.page/ to browse the archived site
- **Wayback Machine**: Submit your WARC to the Internet Archive for long-term preservation

## Notes

- WARC files can be large (especially with images). The archive will include all assets needed to view the site offline.
- The archive preserves the website as it appears at the time of creation.
- WARC is a standard format used by libraries and archives for web preservation.

