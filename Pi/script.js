let isSubmitted = false;

const stopWordsList = [
    "i", "me", "my", "myself", "we", "our", "ours", "ourselves", "you", "your", 
    "yours", "yourself", "yourselves", "he", "him", "his", "himself", "she", 
    "her", "hers", "herself", "it", "its", "itself", "they", "them", "their", 
    "theirs", "themselves", "what", "which", "who", "whom", "this", "that", 
    "these", "those", "am", "is", "are", "was", "were", "be", "been", "being", 
    "have", "has", "had", "having", "do", "does", "did", "doing", "a", "an", 
    "the", "and", "but", "if", "or", "because", "as", "until", "while", "of", 
    "at", "by", "for", "with", "about", "against", "between", "into", "through", 
    "during", "before", "after", "above", "below", "to", "from", "up", "down", 
    "in", "out", "on", "off", "over", "under", "again", "further", "then", 
    "once", "here", "there", "when", "where", "why", "how", "all", "any", 
    "both", "each", "few", "more", "most", "other", "some", "such", "no", 
    "nor", "not", "only", "own", "same", "so", "than", "too", "very", "s", 
    "t", "can", "will", "just", "don", "should", "now"
];

const suffixes = [
    'able', 'ible', 'al', 'ful', 'less', 'ly', 'ment', 'ness', 'sion', 'tion',
    'er', 'or', 'ist', 'ant', 'ent', 'dom', 'ism', 'ity', 'ty', 'ship',
    'age', 'ize', 'ise', 'ify', 'ate', 'en', 'ous', 'ic', 'ive', 'al',
    'esque', 'y', 'ian', 'hood', 'ling', 'some', 'ward', 'wise', 'let', 'ette',
    'ling', 'an', 'ese', 'ic', 'ian', 'ster', 'man', 'ette', 'let', 'ment',
    'ard', 'ness', 'ship', 'sion', 'tion', 'er', 'or', 'ee', 'ant', 'ent',
    'ess', 'ive', 'y', 'ish', 'ous', 'ical', 'tive', 'less', 'ful', 'able',
    'ible', 'ment', 'tion', 'sion', 'dom', 'hood', 'cy', 'ty', 'ity',
    'ism', 'ship', 'ist', 'er', 'or', 'ant', 'ent', 'ize', 'ate', 'ify',
    'en', 'ous', 'ic', 'al', 'ly', 'ish', 'ful', 'less', 'ish', 'ive', 'ing', 'cy', 'ning'
];

    
function removeSymbols(userInput) {
    const removedSymbolsInput = userInput.replace(/[^a-zA-Z0-9\s.]+/g, ''); // Retain periods and spaces
    const symbolsList = userInput.match(/[^a-zA-Z0-9\s]+/g) || []; // Handle null case
    return { removedSymbolsInput, symbolsList };
}

// Function to remove suffixes from words
function removeSuffixes(words) {
    return words.map(word => {
        for (let suffix of suffixes) {
            if (word.endsWith(suffix)) {
                return word.replace(new RegExp(`${suffix}$`), ''); // Remove the suffix
            }
        }
        return word; // Return the word as is if no suffix is found
    });
}

// Function to identify special names
function identifySpecialNames(userInput) {
    const specialNames = [];
    const sentences = userInput.split('.'); // Split by sentences
    const seenNames = new Set(); // To track duplicates

    sentences.forEach(sentence => {
        const words = sentence.trim().split(/\s+/); // Split into words
        if (words.length === 0) return; // Skip if no words

        for (let i = 1; i < words.length; i++) { // Start from index 1 to skip the first word
            const currentWord = words[i].replace(/[^a-zA-Z]/g, ''); // Remove symbols
            const nextWord = words[i + 1] ? words[i + 1].replace(/[^a-zA-Z]/g, '') : '';

            // Skip if the current word is a stop word
            if (stopWordsList.includes(currentWord.toLowerCase())) {
                continue;
            }

            // Check for capitalized current word
            if (/^[A-Z]/.test(currentWord)) {
                // Check if the next word is also capitalized
                if (/^[A-Z]/.test(nextWord) && !stopWordsList.includes(nextWord.toLowerCase())) {
                    // Combine current and next words
                    const combinedName = `${currentWord} ${nextWord}`;
                    if (!seenNames.has(combinedName)) {
                        specialNames.push(combinedName);
                        seenNames.add(combinedName);
                        i++; // Skip the next word since we've combined it
                    }
                } else {
                    // Add current word if it's not a stop word
                    if (!seenNames.has(currentWord)) {
                        specialNames.push(currentWord);
                        seenNames.add(currentWord);
                    }
                }
            }
        }
    });

    // Remove duplicates while keeping the last occurrence
    return Array.from(new Set(specialNames.reverse())).reverse(); // Keeps only the last occurrence
}

// Function to determine the type of each sentence
function determineSentenceTypes(userInput) {
    // Split the input into sentences using regex to account for multiple end punctuation
    const sentences = userInput.split(/(?<=[.!?])/); // Split by period, exclamation, or question mark
    const sentenceTypes = []; // Array to hold sentence types

    sentences.forEach(sentence => {
        const trimmedSentence = sentence.trim(); // Remove leading/trailing whitespace
        
        // Skip empty sentences
        if (trimmedSentence.length === 0) return;

        // Normalize the sentence for easier checks
        const normalizedInput = trimmedSentence.toLowerCase();
        
        // Remove negation logic temporarily
        // const hasNegation = /not|n't/.test(normalizedInput);
        
        // Check the last character of the sentence
        const lastChar = trimmedSentence.slice(-1);
        
        let sentenceType = 'Unknown';

        // Determine the sentence type based on its last character
        if (lastChar === '.') {
            sentenceType = 'Declarative'; // Normal declarative sentence
        } else if (lastChar === '?') {
            sentenceType = 'Interrogative'; // Question
        } else if (lastChar === '!') {
            sentenceType = 'Exclamatory'; // Exclamation
        }

        // Add the determined type to the array
        sentenceTypes.push(sentenceType);
    });

    // Output the types of sentences to the console
    sentenceTypes.forEach((type, index) => {
        console.log(`Sentence ${index + 1}: ${type}`);
    });

    return sentenceTypes;
}

// Function to analyze the user input
function analyzeInput(userInput) {
    // Split by lines to count lines
    const lines = userInput.split('\n');
    const lineCount = lines.length;

    // Split into sentences
    const sentences = userInput.split(/(?<=[.!?])/).filter(sentence => sentence.trim() !== '');
    const sentenceCount = sentences.length;

    // Split into words
    const words = userInput.split(/\s+/).filter(word => word.trim() !== '');
    const wordCount = words.length;

    // Count characters
    const characterCount = userInput.length;

    // Count symbols
    const symbols = userInput.match(/[^a-zA-Z0-9\s]/g) || [];
    const symbolCount = symbols.length;

    // Count numbers
    const numbers = userInput.match(/\d+/g) || [];
    const numberCount = numbers.length;

    // Log the analysis results
    console.log(`Total Lines: ${lineCount}`);
    console.log(`Total Sentences: ${sentenceCount}`);
    console.log(`Total Words: ${wordCount}`);
    console.log(`Total Characters: ${characterCount}`);
    console.log(`Total Symbols: ${symbolCount}`);
    console.log(`Total Numbers: ${numberCount}`);
}

// Main function to process text
function processText() {


    // Get user input from the input text area
    let userInput = document.getElementById('inputText').value;

    // Analyze the user input
    analyzeInput(userInput);

    document.getElementById('inputText').style.height = '0';
    document.getElementById('inputText').style.opacity = '0';

    // Determine the types of sentences
    const sentenceTypes = determineSentenceTypes(userInput);

    // Tokenize input into words
    const tokenizedInput = userInput.split(/[\s]+/); // Use regex to split by whitespace
    console.log(`Words: ${tokenizedInput.join(', ')}`);

    // Remove symbols and log results
    const { removedSymbolsInput, symbolsList } = removeSymbols(userInput);
    console.log(`Removed Symbols Input: ${removedSymbolsInput}`);
    console.log(`Found Symbols: ${symbolsList.join(' ')}`);

    // Convert words to lowercase and filter out stop words
    const lowercasedInput = tokenizedInput.map(word => word.toLowerCase());
    const removedStopWords = lowercasedInput.filter(word => !stopWordsList.includes(word));
    console.log(`Removed Stop Words: ${removedStopWords.join(', ')}`);

    // Remove suffixes
    const removedSuffixes = removeSuffixes(removedStopWords);
    console.log(`Words with Suffixes Removed: ${removedSuffixes.join(', ')}`);

    // Identify special names
    const uniqueSpecialNames = identifySpecialNames(userInput);
    console.log(`Unique Special Names: ${uniqueSpecialNames.join(', ')}`);
    document.getElementById("processBtn").value = 'Try Again'

    isSubmitted = true;

}

// Event listener for the button
document.getElementById("processBtn").addEventListener("click", () => {
    if (isSubmitted) {
        window.location.reload();
    } else {
        processText();
        document.getElementById("processBtn").textContent = 'Retry';
    }
});


// Select the unordered list element
const consoleLogList = document.getElementById('consoleLog');

// Store the original console.log function
const originalConsoleLog = console.log;

// Override console.log
console.log = function(...args) {
    // Call the original console.log to still log in the console
    originalConsoleLog.apply(console, args);

    // Create a new list item for the console log
    const listItem = document.createElement('li');

    // Create the content part, limited display
    const content = args.join(' ');
    const limitedContent = content.length > 80 ? content.substring(0, 80) + '...' : content;

    // Create a span to hold the limited content
    const contentSpan = document.createElement('span');
    contentSpan.textContent = limitedContent;

    // Create a hidden div for the remaining content
    const remainingContent = document.createElement('div');
    remainingContent.className = 'more-content';
    remainingContent.textContent = content.length > 80 ? content.substring(80) : '';
    remainingContent.style.display = 'none'; // Hide by default

    // Append elements to the list item
    listItem.appendChild(contentSpan);

    // Check if the content is longer than 80 characters to decide on displaying "more..."
    if (content.length > 80) {
        // Create the expand button
        const expandButton = document.createElement('span');
        expandButton.className = 'expand-button';
        expandButton.textContent = 'more...';
        
        expandButton.onclick = function() {
            // Toggle visibility of remaining content
            if (remainingContent.style.display === 'none') {
                remainingContent.style.display = 'block';
                expandButton.textContent = 'less...'; // Change button text to "less"
            } else {
                remainingContent.style.display = 'none';
                expandButton.textContent = 'more...'; // Change button text back to "more"
            }
        };

        // Append the expand button and remaining content to the list item
        listItem.appendChild(expandButton);
        listItem.appendChild(remainingContent); // Append remaining content div
    } else {
        // If the content is 80 characters or less, just append the content span
        listItem.appendChild(contentSpan);
    }

    // Append the new list item to the unordered list
    consoleLogList.appendChild(listItem);

    // Trigger the animation
    setTimeout(() => {
        listItem.classList.add('visible'); // Add the class to trigger animation
    }, 10); // Short timeout to ensure the class is added after the element is in the DOM
};



setTimeout(() => {
    document.getElementById('inputText').style.height = '50%';
    document.getElementById('inputText').style.opacity = '1';
}, 50); // Adjust the delay as needed (1000ms = 1 second)

