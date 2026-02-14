from scrapy_redis.spiders import RedisCrawlSpider
from scrapy.linkextractors import LinkExtractor
from scrapy.spiders import Rule
from bablu.items import NittRagItem
import fitz
import pymupdf4llm


class NittSpider(RedisCrawlSpider):
    name = 'nitt'
    redis_key = 'nitt:start_urls'
    
    allowed_domains = ['nitt.edu']

    rules = (
        Rule(
            LinkExtractor(
                allow=[r'faculty', r'people', r'curriculum', r'academics', r'dept', r'profile'],
                deny=[
                    r'login', r'register', r'resetPasswd', r'reSendKey', r'subaction', r'action', r'\+', r'tender'
                ],
                deny_extensions=[]  # Ensure PDFs are scraped
            ),
            callback='parse',
            follow=True,
            process_request='set_priority'
        ),
        Rule(
            LinkExtractor(
                allow=r'^https?://(www\.)?nitt\.edu/',
                deny=[
                    r'login', r'register', r'resetPasswd', r'reSendKey', r'subaction', r'action', r'\+', r'tender'
                ],
                deny_extensions=[], 
            ), 
            callback='parse', 
            follow=True,
            process_request='set_priority'
        ),
    )

    def set_priority(self, request, response):
        if request.url.lower().endswith(".pdf"):
            request.priority = 10
        else:
            request.priority = 0
        return request

    def parse(self, response):
        
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