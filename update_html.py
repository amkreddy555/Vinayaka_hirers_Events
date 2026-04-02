import re

with open("index.html", "r", encoding="utf-8") as f:
    html = f.read()

def repl(m):
    h3_content = m.group(1).strip()
    encoded = "Hello Vinayaka Events,%0AI would like to enquire about your " + h3_content.replace(' ', '%20').replace('&', '%26') + " packages."
    
    link = f'\n            <a href="https://wa.me/919110733442?text={encoded}" class="service-link" target="_blank">Enquire Now <i class="fas fa-arrow-right"></i></a>'
    return f'<div class="service-content">\n            <h3>{h3_content}</h3>\n            <p>{m.group(2)}</p>{link}\n          </div>'

new_html = re.sub(r'<div class="service-content">\s*<h3>(.*?)</h3>\s*<p>(.*?)</p>\s*</div>', repl, html, flags=re.DOTALL)

with open("index.html", "w", encoding="utf-8") as f:
    f.write(new_html)
