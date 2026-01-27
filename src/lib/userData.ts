const userData = [
  { income: 315000, occupation: "Sales staff", education: "Higher education", familyStatus: "Married", children: 0, ownRealty: true, ownCar: true, age: 37, creditAmount: 450000 },
  { income: 180000, occupation: "Core staff", education: "Higher education", familyStatus: "Single / not married", children: 0, ownRealty: true, ownCar: true, age: 39, creditAmount: 463500 },
  { income: 90000, occupation: "Sales staff", education: "Secondary / secondary special", familyStatus: "Married", children: 2, ownRealty: false, ownCar: true, age: 31, creditAmount: 675000 },
  { income: 135000, occupation: "Laborers", education: "Secondary / secondary special", familyStatus: "Married", children: 0, ownRealty: true, ownCar: true, age: 30, creditAmount: 454500 },
  { income: 450000, occupation: "Managers", education: "Higher education", familyStatus: "Married", children: 0, ownRealty: true, ownCar: true, age: 36, creditAmount: 1350000 }
];

let currentUser: typeof userData[0] | null = null;

export const getRandomUser = () => {
  if (!currentUser) {
    currentUser = userData[Math.floor(Math.random() * userData.length)];
  }
  return currentUser;
};

export const getUserContext = () => {
  const user = getRandomUser();
  const riskLevel = user.income > 300000 && user.ownRealty ? 'LOW' : user.income > 150000 ? 'MEDIUM' : 'HIGH';
  const tier = user.income > 300000 ? 'Premium' : user.income > 150000 ? 'Standard' : 'Basic';
  
  return {
    ...user,
    riskLevel,
    tier,
    personalizedGreeting: `Como ${user.occupation}${user.children > 0 ? ` con ${user.children} hijos` : ''} con ingresos de €${user.income.toLocaleString()}`,
    recommendations: [
      ...(user.income > 250000 ? ["Tarjeta Premium con límites altos"] : []),
      ...(user.ownRealty ? ["Préstamo con garantía"] : []),
      ...(user.children > 0 ? ["Cuenta de ahorro educativo"] : [])
    ]
  };
};