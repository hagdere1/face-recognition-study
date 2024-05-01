export const PRETRIAL_QUESTIONS = [
    {
        id: "age",
        question: "What is your current age?",
        options: [
            "18-28",
            "29-38",
            "39-48",
            "49-58",
            "59-65"
        ]
    },
    {
        id: "gender",
        question: "Which most accurately describes your gender?",
        options: [
            "Male",
            "Female",
            "Non-Binary",
            "Prefer not to say"
        ]
    },
    {
        id: "ethnicity",
        question: "What is your ethnicity?",
        options: [
            "White (non-Hispanic)",
            "Hispanic",
            "Black",
            "Asian",
            "Multi-Racial",
            "Other"
        ]
    },
    {
        id: "familySize",
        question: "How would you describe the size of your current family?",
        options: [
            "Small (only child)",
            "Medium (1-2 siblings)",
            "Large (2+ siblings)"
        ]
    },
    {
        id: "parentsMaritalStatus",
        question: "What is the marital status of your parents?",
        options: [
            "Married",
            "Separated",
            "Divorced"
        ]
    },
    {
        id: "socialLife",
        question: "How would you describe your social life?",
        options: [
            "I keep to myself",
            "I have one best friend",
            "I have a few close friends who I primarily interact with",
            "I have a group of friends with whom I enjoy spending time",
            "I am very social"
        ]
    },
    {
        id: "numDailyPeopleSpeaking",
        question: "Roughly how many people do you speak with, on average, each day?",
        options: [
            "Zero",
            "Below an average amount (work solitarily most of the time)",
            "An average amount (work with a few people regularly)",
            "More than an average amount (meeting with small teams regularly)",
            "A large amount (interacting with groups of people)"
        ]
    },
    {
        id: "relationshipStatus",
        question: "What is your relationship status?",
        options: [
            "Single",
            "In a relationship",
            "Engaged",
            "Married",
            "Divorced"
        ]
    },
    {
        id: "memoryNames",
        question: "How would you rate your memory with people’s names?",
        options: [
            "Very below average",
            "Below average",
            "Average",
            "Above average",
            "Very above average"
        ]
    },
    {
        id: "memoryFaces",
        question: "How would you rate your memory with people’s faces?",
        options: [
            "Very below average",
            "Below average",
            "Average",
            "Above average",
            "Very above average"
        ]
    }
]
export const PRETRIAL_QUESTIONS_ORPHAN = [
    ...PRETRIAL_QUESTIONS,
    {
        id: "adoptedAge",
        question: "At what age were you separated from your biological parents?",
        options: [
            "0-3",
            "4-6",
            "7-10",
            "11-13"
        ]
    },
    {
        id: "adoptedTransitionProcess",
        question: "How would you best describe the transition process?",
        options: [
            "Simple",
            "Some challenges",
            "Very difficult"
        ]
    },
]
export const POSTTRIAL_QUESTIONS = [
    {
        id: "difficulty_trial1",
        question: "How difficult would you say the first test was?",
        options: [
            "Very easy",
            "Easy",
            "Average",
            "Difficult",
            "Very difficult"
        ]
    },
    {
        id: "difficulty_trial2",
        question: "How difficult would you say the second test was?",
        options: [
            "Very easy",
            "Easy",
            "Average",
            "Difficult",
            "Very difficult"
        ]
    },
    {
        id: "performance_trial1",
        question: "How do you think you performed on the first task?",
        options: [
            "Very above average",
            "Above average",
            "Average",
            "Below average",
            "Very below average"
        ]
    },
    {
        id: "performance_trial2",
        question: "How do you think you performed on the second task?",
        options: [
            "Very above average",
            "Above average",
            "Average",
            "Below average",
            "Very below average"
        ]
    },
    {
        id: "memory_strategies",
        question: "Did you use any memory strategies to help you remember?",
        options: [
            "Yes",
            "No"
        ]
    },
    {
        id: "memory_strategies_self",
        question: "Do you believe that some of the strategies you used were connected to your own beliefs, preferences, and ideas?",
        options: [
            "Yes",
            "No"
        ]
    },
    {
        id: "memory_strategies_people",
        question: "If yes, do you use similar strategies when meeting new people?",
        options: [
            "Yes",
            "No"
        ]
    },
    {
        id: "accuracy",
        question: "Do you think your results accurately reflect how well you remember faces and names?",
        options: [
            "Yes",
            "No"
        ]
    }
]