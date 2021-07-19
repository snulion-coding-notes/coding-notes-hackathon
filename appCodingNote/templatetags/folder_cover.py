import random
from django import template
register = template.Library()

@register.simple_tag
def random_num():
  return random.randint(0,2)

@register.filter
def modulo(val):
  return val%3