const state = {
	tabbarState:0,
	myApi:'http://localhost:3000',
	color: 4,
	colors: [
		{bg:'#FFA500',bgMain:'#F8F8FF',cl:'#FFFFF0',tb:'#fff',info:'rgba(0, 0, 0, 0.6)',txt:'#333'},
		{bg:'#212121',bgMain:'#212121',cl:'#FFD700',tb:'#333',info:'rgba(221, 221, 221, 0.7)',txt:'#fff'},
		{bg:'#2CA2F9',bgMain:'#F8F8FF',cl:'#FFFFF0',tb:'#333',info:'rgba(0, 0, 0, 0.6)',txt:'#333'},
		{bg:'#D43C33',bgMain:'#F8F8FF',cl:'#FFFFF0',tb:'#fff',info:'rgba(0, 0, 0, 0.6)',txt:'#333'},
		{bg:'#31C27C',bgMain:'#F8F8FF',cl:'#FFFFF0',tb:'#fff',info:'rgba(0, 0, 0, 0.6)',txt:'#333'}
	],
	active: 0
}

export default state;