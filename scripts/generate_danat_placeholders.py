from pathlib import Path

groups = {
  'tea-and-coffee': 'Tea and coffee',
  'sugar': 'Sugar',
  'tuna-and-sardines': 'Tuna and sardines',
  'biscuits-and-chocolate': 'Biscuits and chocolate',
  'couscous-pasta-semolina-flour': 'Couscous, pasta, semolina, and flour',
  'syrups-beverages-vinegar-jam-tomato-paste': 'Syrups, beverages, vinegar, jam, and tomato paste',
  'olives-preserved-lemon-harissa-khleaa': 'Olives, preserved lemon, harissa, and khleaa',
  'baking-and-dessert-products': 'Baking and dessert products',
  'sauces-and-dressings': 'Sauces and dressings',
  'tagines-and-ceramics': 'Tagines and ceramics',
  'tea-cups-tea-trays-couscous-pots-and-teapots': 'Tea cups, tea trays, couscous pots, and teapots'
}

base_dir = Path('public/images/catalog/danat-al-jazeera/groups')
base_dir.mkdir(parents=True, exist_ok=True)

supplier_dir = Path('public/images/catalog/danat-al-jazeera/supplier')
supplier_dir.mkdir(parents=True, exist_ok=True)

svg_tpl = """<svg xmlns='http://www.w3.org/2000/svg' width='1200' height='800' viewBox='0 0 1200 800' role='img' aria-labelledby='title desc'>
  <title>{title}</title>
  <desc>{desc}</desc>
  <defs>
    <linearGradient id='bg' x1='0' y1='0' x2='1' y2='1'>
      <stop offset='0%' stop-color='#F5F1EA'/>
      <stop offset='100%' stop-color='#DCC8A6'/>
    </linearGradient>
  </defs>
  <rect width='1200' height='800' fill='url(#bg)'/>
  <circle cx='940' cy='170' r='140' fill='#8B1A4A' fill-opacity='0.14'/>
  <rect x='120' y='170' width='960' height='460' rx='40' fill='#2A2016' fill-opacity='0.08'/>
  <text x='600' y='390' text-anchor='middle' fill='#2A2016' font-size='52' font-family='Manrope, Arial, sans-serif'>{title}</text>
  <text x='600' y='450' text-anchor='middle' fill='#2A2016' fill-opacity='0.72' font-size='28' font-family='Manrope, Arial, sans-serif'>Danat Al Jazeera Catalog Placeholder</text>
</svg>
"""

for slug, label in groups.items():
    path = base_dir / f'{slug}.svg'
    path.write_text(svg_tpl.format(title=label, desc=f'{label} placeholder image from supplier catalog grouping.'), encoding='utf-8')

for name, label in [('banner','Danat Al Jazeera Banner'),('logo','Danat Al Jazeera Logo'),('avatar','Danat Al Jazeera Avatar')]:
    (supplier_dir / f'{name}.svg').write_text(svg_tpl.format(title=label, desc=f'{label} placeholder.'), encoding='utf-8')

print('generated group and supplier placeholders')
