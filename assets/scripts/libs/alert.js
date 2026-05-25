// Ensure SweetAlert2 is loaded before running this script
// <script src="https://cdn.jsdelivr.net/npm/sweetalert2@11"></script>

/**
 * Enhanced replacement for alert()
 * @param {string} message - The text to display
 * @param {string} title - Optional header title
 */
export async function customAlert(message, title = 'Alert') {
    await Swal.fire({
        title: title,
        text: message,
        icon: 'info',
        confirmButtonColor: '#3085d6',
        confirmButtonText: 'OK'
    });
}

/**
 * Enhanced replacement for prompt()
 * @param {string} message - The placeholder or prompt message
 * @param {string} defaultValue - Optional default value for the input field
 * @returns {Promise<string|null>} The user input string, or null if cancelled
 */
export async function customPrompt(message, defaultValue = '') {
    const { value: text, isDismissed } = await Swal.fire({
        title: message,
        input: 'text',
        inputValue: defaultValue,
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        inputValidator: (value) => {
            // Optional: Remove this if you want to allow empty submissions
            if (!value.trim()) {
                return 'You need to enter something!';
            }
        }
    });

    if (isDismissed) {
        return null; // Mimics native prompt() returning null on Cancel
    }
    return text;
}
