export class GiftSkin {
  constructor({
    id,
    name,
    description,
    weapon,
    category,
    pattern = null,
    min_float = null,
    max_float = null,
    rarity,
    stattrak = false,
    paint_index = null,
    crates = [],
    team,
    image,
  }) {
    this.id = id;
    this.name = name;
    this.description = description;
    this.weapon = weapon;
    this.category = category;
    this.pattern = pattern;
    this.min_float = min_float;
    this.max_float = max_float;
    this.rarity = rarity;
    this.stattrak = stattrak;
    this.paint_index = paint_index;
    this.crates = crates;
    this.team = team;
    this.image = image;
  }
}
