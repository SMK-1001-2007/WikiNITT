# spiders/nitt_spider.py
import scrapy
import json
import os
from urllib.parse import urlparse
from bablu.items import NittRagItem
import fitz # PyMuPDF
import pymupdf4llm 

class NittSpider(scrapy.Spider):
    name = "nitt"
    allowed_domains = ["nitt.edu"]
    start_urls = ["https://www.nitt.edu/"]

    PROCESSED_LOG_PATH = "nitt_vector_db/processed_urls.json" 
    processed_urls = set()

    def start_requests(self):
        if os.path.exists(self.PROCESSED_LOG_PATH):
            try:
                with open(self.PROCESSED_LOG_PATH, "r") as f:
                    self.processed_urls = set(json.load(f))
                self.logger.info(f"🔄 RESUMING: Found {len(self.processed_urls)} already indexed URLs.")
            except:
                self.logger.warning("⚠️ Could not load processed log. Starting fresh check.")
        
        for url in self.start_urls:
            yield scrapy.Request(url, self.parse)

    def parse(self, response):
        if response.url in self.processed_urls:
            self.logger.info(f"⏭️  SKIPPING CONTENT (Already Indexed): {response.url}")
        else:
            if self._is_pdf(response):
                yield from self.parse_pdf(response)
                return 

            item = NittRagItem()
            item['url'] = response.url
            item['file_type'] = 'html'
            item['title'] = response.css('title::text').get()
            
            body_text = response.css('body *::text').getall()
            item['raw_text'] = " ".join(body_text) if body_text else ""
            
            yield item

        for href in response.css('a::attr(href)').getall():
            absolute_url = response.urljoin(href)
            
            domain = urlparse(absolute_url).netloc.lower()
            
            if domain in ["nitt.edu", "www.nitt.edu"]:
                yield response.follow(absolute_url, self.parse)

    def parse_pdf(self, response):
        item = NittRagItem()
        item['url'] = response.url
        item['file_type'] = 'pdf'
        item['title'] = response.url.split("/")[-1]
        
        try:
            with fitz.open(stream=response.body, filetype="pdf") as doc:
                md_text = pymupdf4llm.to_markdown(doc, write_images=False)
                header = f"# Source Document: {item['title']}\n# URL: {response.url}\n\n"
                item['raw_text'] = header + md_text
            yield item
        except Exception as e:
            self.logger.error(f"Failed to parse PDF {response.url}: {e}")

    def _is_pdf(self, response):
        return (response.url.lower().endswith(".pdf") or 
                b'application/pdf' in response.headers.get('Content-Type', b'') or
                response.body.startswith(b'%PDF'))