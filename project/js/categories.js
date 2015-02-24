var nutrition = {
	{type: "Fibrer(g)"},

	{type: "Salt(g)"},

	{type: "Aska(g)"},

	{type: "Vatten(g)"},

	{type: "Alkohol(g)"},

	{type: "Protein(g)"},

	{type: "Kolhydrater(g)",
		children: [
			{type: "monosackarider(g)"},
			{type: "disackarider(g)"}
			{type: "sackaros(g)"}
			{type: "fullkorn totalt(g)"}
		]},

	{type: "Fett(g)"},

	{type: "Fettsyror(g)"
		children: [
			{type: "summa mättade fettsyror(g)",
			children: [
				{type: "Fettsyra 4:0-10:0(g)"},
				{type: "Fettsyra 12:0(g)"},
				{type: "Fettsyra 14:0(g)"},
				{type: "Fettsyra 16:0(g)"},
				{type: "Fettsyra 18:0(g)"},
				{type: "Fettsyra 20:0(g)"}
			]},
			{type: "summa enkelomättade fettsyror(g)",
			children: [
				{type: "Fettsyra 16:1(g)"},
				{type: "Fettsyra 18:1(g)"}
			]},
			{type: "summa fleromättade fettsyror(g)"},
			{type: "summa n-6 fettsyror(g)",
			children: [
				{type: "Fettsyra 18:2(g)"},
				{type: "Fettsyra 20:4(g)"}
			]},
			{type: "summa n-3 fettsyror(g)",
			children: [
				{type: "Fettsyra 18:3(g)"}
			]},
			{type: "summa långa n-3 fettsyror(g)",
			children: [
				{type: "EPA (Fettsyra 20:5)(g)"},
				{type: "DPA (Fettsyra 22:5)(g)"},
				{type: "DHA (Fettsyra 22:6)(g)"}
			]},
			{type: "summa transfettsyror(g)"}
		]},

	{type: "Kolesterol(mg)"},

	{type: "Fettlösliga vitaminer",
	children: [
		{type: "Vitamin A()"},
		{type: "Retinol(µg)"},
		{type: "beta-Karoten(µg)"},
		{type: "Vitamin D(µg)"},
		{type: "Vitamin E(mg)"},
		{type: "Vitamin K(µg)"}
	]},

{type: "Vattenlösliga vitaminer",
	children: [
		{type: "Tiamin(mg)"},
		{type: "Riboflavin(mg)"},
		{type: "Vitamin C(mg)"},
		{type: "Niacin(mg)"},
		{type: "Niacinekvivalenter()"},
		{type: "Vitamin B6(mg)"},
		{type: "Vitamin B12(µg)"},
		{type: "Folat(µg)"}
	]},

	{type: "Mineraler",
	children: [
		{type: "Fosfor(mg)"},
		{type: "Jod(µg)"},
		{type: "Järn(mg)"},
		{type: "Kalcium(mg)"},
		{type: "Kalium(mg)"},
		{type: "Magnesium(mg)"},
		{type: "Natrium(mg)"},
		{type: "Selen(µg)"},
		{type: "Zink(mg)"}
	]},

	{type: "Avfall (skal etc.)(%)"}

}