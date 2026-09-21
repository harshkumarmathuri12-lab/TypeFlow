// ==========================================
// TypeFlow Quotes Database
// js/quotes.js
// ==========================================

const quotes = [

  "stay hungry stay foolish",

  "practice makes perfect",

  "knowledge is power",

  "never stop learning",

  "discipline beats motivation",

  "consistency creates success",

  "hard work always pays off",

  "small steps every day lead to big results",

  "dream big work hard stay humble",

  "your only limit is your mind",

  "every expert was once a beginner",

  "mistakes are proof that you are trying",

  "the future belongs to those who prepare today",

  "focus on progress not perfection",

  "success is built one day at a time",

  "great things never come from comfort zones",

  "believe you can and you are halfway there",

  "do something today your future self will thank you for",

  "quality is not an act it is a habit",

  "action is the foundational key to all success",

  "learning never exhausts the mind",

  "time is what we want most but what we use worst",

  "the secret of getting ahead is getting started",

  "well done is better than well said",

  "fortune favors the brave",

  "simplicity is the ultimate sophistication",

  "the best way to predict the future is to create it",

  "success is the sum of small efforts repeated daily",

  "do not watch the clock do what it does keep going",

  "a goal without a plan is only a wish",

  "your habits decide your future",

  "one hour of practice beats one day of excuses",

  "confidence comes from preparation",

  "focus is a superpower in a distracted world",

  "keep moving forward no matter how slow",

  "every day is another chance to improve",

  "discipline is choosing what you want most over what you want now",

  "success begins with self belief",

  "strong minds create strong futures",

  "never let fear decide your destiny",

  "coding is the art of solving problems",

  "logic is stronger than luck",

  "every line of code teaches something new",

  "debugging is learning in disguise",

  "good programmers write clean readable code",

  "consistency beats intensity",

  "progress happens one keystroke at a time",

  "great software starts with simple ideas",

  "the harder you work the luckier you become",

  "patience and persistence make the impossible possible"

];

// Random Quote

function getRandomQuote(){

  return quotes[
    Math.floor(Math.random()*quotes.length)
  ];

}