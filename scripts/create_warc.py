#!/usr/bin/env python3
"""
Script to create a WARC archive of the Bed-Stuy Signs website.
Requires: pip install warcit
"""

import subprocess
import sys
import os

def create_warc():
    """Create a WARC file of the GitHub Pages site"""
    site_url = "https://alexmcqw.github.io/Bed-Stuy-signs/"
    output_file = "bed-stuy-signs-archive.warc.gz"
    
    print(f"Creating WARC archive of {site_url}")
    print(f"Output file: {output_file}")
    print("\nThis may take a few minutes...")
    
    try:
        # Use warcit to create the archive
        cmd = [
            "warcit",
            "--no-capture-time",
            "--warc-file", output_file,
            site_url
        ]
        
        result = subprocess.run(cmd, check=True, capture_output=True, text=True)
        print(f"\n✅ Successfully created {output_file}")
        print(f"File size: {os.path.getsize(output_file) / (1024*1024):.2f} MB")
        return True
        
    except subprocess.CalledProcessError as e:
        print(f"❌ Error: {e.stderr}")
        print("\nTo install warcit, run: pip install warcit")
        return False
    except FileNotFoundError:
        print("❌ warcit not found. Install it with: pip install warcit")
        return False

if __name__ == "__main__":
    create_warc()

