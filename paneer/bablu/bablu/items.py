# Define here the models for your scraped items
#
# See documentation in:
# https://docs.scrapy.org/en/latest/topics/items.html

import scrapy


class BabluItem(scrapy.Item):
    url = scrapy.Field()
    source_url = scrapy.Field()
    content_type = scrapy.Field()
    body = scrapy.Field()

class NittRagItem(scrapy.Item):
    url = scrapy.Field()          # The source URL (nitt.edu/...)
    title = scrapy.Field()        # Page title or PDF filename
    file_type = scrapy.Field()    # 'html' or 'pdf'
    raw_text = scrapy.Field()     # The messy raw text content
    cleaned_text = scrapy.Field() # The cleaned text content
    file_path = scrapy.Field()    # Local path if you downloaded it (optional)