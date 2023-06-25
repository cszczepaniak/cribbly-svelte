interface Player {
	firstName: string;
	lastName: string;
}

export const getTeamName = (players: Player[] | undefined) => {
	if (players === undefined) {
		return "<undefined>";
	}
	if (players[0] && !players[1]) {
		return `Team ${players[0]?.lastName}`;
	} else if (players[0] && players[1]) {
		return `Team ${players[0]?.lastName}/${players[1]?.lastName}`;
	}
	return "New Team";
};
