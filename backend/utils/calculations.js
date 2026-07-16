const ACTIVITY_MULTIPLIERS = {
  sedentary: 1.2,
  light: 1.375,
  moderate: 1.55,
  active: 1.725,
  very_active: 1.9
};

const GOAL_CALORIE_ADJUSTMENTS = {
  weight_loss: -500,
  muscle_gain: 300,
  maintenance: 0
};

const round = (value, digits = 1) => {
  if (value === null || value === undefined || Number.isNaN(Number(value))) {
    return null;
  }

  return Number(Number(value).toFixed(digits));
};

const clamp = (value, min = 0, max = 100) => Math.min(Math.max(value, min), max);

const calculateBMI = (weightKg, heightCm) => {
  if (!weightKg || !heightCm) {
    return null;
  }

  const heightM = heightCm / 100;
  return round(weightKg / (heightM * heightM), 1);
};

const getBMICategory = (bmi) => {
  if (!bmi) return null;
  if (bmi < 18.5) return 'underweight';
  if (bmi < 25) return 'normal';
  if (bmi < 30) return 'overweight';
  return 'obesity';
};

const calculateBMR = ({ gender, weight, height, age }) => {
  if (!weight || !height || !age) {
    return null;
  }

  // Mifflin-St Jeor formula. For "other", use a neutral midpoint.
  const base = 10 * weight + 6.25 * height - 5 * age;
  const genderAdjustment = gender === 'male' ? 5 : gender === 'female' ? -161 : -78;

  return Math.round(base + genderAdjustment);
};

const calculateDailyCalories = (bmr, activityLevel = 'moderate') => {
  if (!bmr) {
    return null;
  }

  const multiplier = ACTIVITY_MULTIPLIERS[activityLevel] || ACTIVITY_MULTIPLIERS.moderate;
  return Math.round(bmr * multiplier);
};

const calculateGoalCalories = (maintenanceCalories, goalType) => {
  if (!maintenanceCalories) {
    return null;
  }

  const adjustment = GOAL_CALORIE_ADJUSTMENTS[goalType] || 0;
  return Math.max(Math.round(maintenanceCalories + adjustment), 1200);
};

const calculateDifferences = (current = {}, goal = {}) => ({
  weight: round(goal.desiredWeight - current.weight),
  bodyFatPercentage: round(goal.desiredBodyFatPercentage - current.bodyFatPercentage),
  waist: round(goal.desiredWaist - current.waist),
  chest: round(goal.desiredChest - current.chest),
  hips: round(goal.desiredHips - current.hips)
});

const calculateMetricProgress = (startValue, currentValue, targetValue) => {
  if (startValue === undefined || currentValue === undefined || targetValue === undefined) {
    return null;
  }

  const totalChange = Math.abs(startValue - targetValue);
  if (totalChange === 0) {
    return 100;
  }

  const completedChange = Math.abs(startValue - currentValue);
  return round(clamp((completedChange / totalChange) * 100), 0);
};

const calculateProgress = (start = {}, current = {}, goal = {}) => {
  const progress = {
    weight: calculateMetricProgress(start.weight, current.weight, goal.desiredWeight),
    bodyFatPercentage: calculateMetricProgress(
      start.bodyFatPercentage,
      current.bodyFatPercentage,
      goal.desiredBodyFatPercentage
    ),
    waist: calculateMetricProgress(start.waist, current.waist, goal.desiredWaist),
    chest: calculateMetricProgress(start.chest, current.chest, goal.desiredChest),
    hips: calculateMetricProgress(start.hips, current.hips, goal.desiredHips)
  };

  const values = Object.values(progress).filter((value) => value !== null);
  progress.overall = values.length
    ? round(values.reduce((sum, value) => sum + value, 0) / values.length, 0)
    : null;

  return progress;
};

const calculateGoalTempo = (currentWeight, desiredWeight, targetDate) => {
  if (!currentWeight || !desiredWeight || !targetDate) {
    return null;
  }

  const now = new Date();
  const target = new Date(targetDate);
  const daysLeft = Math.ceil((target - now) / (1000 * 60 * 60 * 24));

  if (daysLeft <= 0) {
    return {
      daysLeft,
      weeksLeft: 0,
      weightChangeKg: round(desiredWeight - currentWeight),
      weeklyChangeKg: null
    };
  }

  const weeksLeft = daysLeft / 7;

  return {
    daysLeft,
    weeksLeft: round(weeksLeft, 1),
    weightChangeKg: round(desiredWeight - currentWeight),
    weeklyChangeKg: round((desiredWeight - currentWeight) / weeksLeft, 2)
  };
};

const getAggressiveGoalWarning = ({ goalType, weeklyChangeKg }) => {
  if (weeklyChangeKg === null || weeklyChangeKg === undefined) {
    return null;
  }

  if (goalType === 'weight_loss' && weeklyChangeKg < -1) {
    return 'Goal may be too aggressive: recommended weight loss is usually up to 0.5-1 kg per week.';
  }

  if (goalType === 'muscle_gain' && weeklyChangeKg > 0.5) {
    return 'Goal may be too aggressive: realistic muscle gain is usually slower than 0.5 kg per week.';
  }

  return null;
};

const buildRecommendations = ({ user, currentMeasurement, goal }) => {
  const currentWeight = currentMeasurement?.weight || user.currentWeight;
  const bmi = calculateBMI(currentWeight, user.height);
  const bmr = calculateBMR({
    gender: user.gender,
    weight: currentWeight,
    height: user.height,
    age: user.age
  });
  const maintenanceCalories = calculateDailyCalories(bmr, user.activityLevel);
  const recommendedCalories = calculateGoalCalories(maintenanceCalories, goal?.goalType);
  const tempo = calculateGoalTempo(currentWeight, goal?.desiredWeight, goal?.targetDate);
  const warning = getAggressiveGoalWarning({
    goalType: goal?.goalType,
    weeklyChangeKg: tempo?.weeklyChangeKg
  });

  return {
    bmi,
    bmiCategory: getBMICategory(bmi),
    bmr,
    maintenanceCalories,
    recommendedCalories,
    calorieAdjustment: goal ? GOAL_CALORIE_ADJUSTMENTS[goal.goalType] || 0 : 0,
    goalTempo: tempo,
    warning,
    messages: buildRecommendationMessages(goal?.goalType, warning)
  };
};

const buildRecommendationMessages = (goalType, warning) => {
  const messages = [];

  if (goalType === 'weight_loss') {
    messages.push('Use a moderate calorie deficit and keep protein intake high enough to preserve muscle mass.');
  } else if (goalType === 'muscle_gain') {
    messages.push('Use a controlled calorie surplus and progressive strength training.');
  } else if (goalType === 'maintenance') {
    messages.push('Keep calories near maintenance and monitor measurements every 1-2 weeks.');
  }

  messages.push('Update body measurements regularly to make the progress charts more accurate.');

  if (warning) {
    messages.push(warning);
  }

  return messages;
};

module.exports = {
  ACTIVITY_MULTIPLIERS,
  buildRecommendations,
  calculateBMI,
  calculateBMR,
  calculateDailyCalories,
  calculateDifferences,
  calculateGoalCalories,
  calculateGoalTempo,
  calculateProgress,
  getAggressiveGoalWarning,
  getBMICategory,
  round
};
