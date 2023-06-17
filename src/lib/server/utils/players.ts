interface Player {
  firstName: string,
  lastName: string,
};

export function fullPlayerName(p: Player | undefined) {
  if (!p) {
    return "";
  }
  return `${p.firstName} ${p.lastName}`;
}
