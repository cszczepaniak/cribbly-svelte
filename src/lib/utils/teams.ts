interface Player {
	firstName: string;
	lastName: string;
}

export const getTeamName = (players: Player[] | undefined) => {
	if (players === undefined) {
		return "<undefined>";
	}
	if (players.length > 0) {
		return players.map(p => `${p.firstName} ${p.lastName}`).join(", ")
	}
	return "No Players";
};
