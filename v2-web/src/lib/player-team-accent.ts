const colors: Readonly<Record<string, string>> = {
  "KADOKAWA FAV gaming": "#74b9ff",
  "Crazy Raccoon": "#ff8f9c",
  "Saishunkan Sol 熊本": "#65d6b0",
  "ZETA DIVISION Geekly": "#ffc66d",
  "広島 TEAM iXA": "#bc9cff",
  "FUKUSHIMA IBUSHIGIN": "#73dce6",
  "VARREL": "#74b9ff",
  "Good 8 Squad": "#ff8f9c",
  "DetonatioN FocusMe": "#65d6b0",
  "名古屋NTPOJA": "#ffc66d",
  "REJECT": "#bc9cff",
  "RIDDLE ORDER": "#73dce6"
};
export function playerTeamAccent(team: string | null | undefined): string | undefined {
  return typeof team === "string" && Object.prototype.hasOwnProperty.call(colors, team) ? colors[team] : undefined;
}
