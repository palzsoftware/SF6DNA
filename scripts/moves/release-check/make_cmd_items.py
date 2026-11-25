"""rows.csv + fill JSON -> cmd_items.json for expected_command_labels.cjs.
python3 -I make_cmd_items.py <rows.csv> <SF6DNA_ALL32_OFFICIAL_MOVE_FILL_20261125.json> > cmd_items.json"""
import csv, json, sys
fill = json.load(open(sys.argv[2], encoding="utf-8"))["byCharacter"]
kind = {(s, r["h"]): r["t"] for s, rows in fill.items() for r in rows}
rows = list(csv.DictReader(open(sys.argv[1], encoding="utf-8-sig")))
print(json.dumps([[f"{x['character']}|{x['hash']}", *x["command"].split(": ", 1), x["name"], kind[(x["character"], x["hash"])]]
                  for x in rows if x["command"]], ensure_ascii=False))
