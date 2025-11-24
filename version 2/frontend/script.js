// Base API URL
const API_BASE = 'http://localhost:5000/api';

// Generic API helper function
async function apiCall(endpoint, options = {}) {
    try {
        const response = await fetch(`${API_BASE}${endpoint}`, {
            headers: {
                'Content-Type': 'application/json',
                ...options.headers
            },
            credentials: 'include', // Important for session cookies
            ...options
        });
        
        if (response.status === 401) {
            // Redirect to login if unauthorized
            window.location.href = 'Login.html';
            return;
        }
        
        if (!response.ok) {
            throw new Error(`API error: ${response.status}`);
        }
        
        return await response.json();
    } catch (error) {
        console.error('API call failed:', error);
        showNotification('Error connecting to server', 'error');
        throw error;
    }
}

// Authentication functions
async function login(username, password) {
    return await apiCall('/login', {
        method: 'POST',
        body: JSON.stringify({ username, password })
    });
}

async function logout() {
    return await apiCall('/logout', { method: 'POST' });
}

async function checkAuth() {
    return await apiCall('/check-auth');
}

// Product functions
async function getStock() {
    return await apiCall('/products');
}

async function addProduct(productData) {
    return await apiCall('/products', {
        method: 'POST',
        body: JSON.stringify(productData)
    });
}

async function updateProduct(productId, productData) {
    return await apiCall(`/products/${productId}`, {
        method: 'PUT',
        body: JSON.stringify(productData)
    });
}

async function deleteProduct(productId) {
    return await apiCall(`/products/${productId}`, {
        method: 'DELETE'
    });
}

// Employee functions
async function getEmployee() {
    return await apiCall('/employees');
}

async function addEmployee(employeeData) {
    return await apiCall('/employees', {
        method: 'POST',
        body: JSON.stringify(employeeData)
    });
}

async function updateEmployee(employeeId, employeeData) {
    return await apiCall(`/employees/${employeeId}`, {
        method: 'PUT',
        body: JSON.stringify(employeeData)
    });
}

async function deleteEmployee(employeeId) {
    return await apiCall(`/employees/${employeeId}`, {
        method: 'DELETE'
    });
}

// Delivery functions
async function getDelivery() {
    return await apiCall('/deliveries');
}

async function addDelivery(deliveryData) {
    return await apiCall('/deliveries', {
        method: 'POST',
        body: JSON.stringify(deliveryData)
    });
}

async function updateDelivery(deliveryId, deliveryData) {
    return await apiCall(`/deliveries/${deliveryId}`, {
        method: 'PUT',
        body: JSON.stringify(deliveryData)
    });
}

async function deleteDelivery(deliveryId) {
    return await apiCall(`/deliveries/${deliveryId}`, {
        method: 'DELETE'
    });
}

// Theme Toggle with persistence
const themeToggle = document.getElementById('theme-toggle');
if (themeToggle) {
    const themeIcon = themeToggle.querySelector('i');

    // Check for saved user preference, if any, on page load
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
        document.body.classList.add('dark-mode');
        themeIcon.classList.remove('fa-moon');
        themeIcon.classList.add('fa-sun');
    } else if (savedTheme === 'light') {
        document.body.classList.remove('dark-mode');
        themeIcon.classList.remove('fa-sun');
        themeIcon.classList.add('fa-moon');
    }

    themeToggle.addEventListener('click', () => {
        document.body.classList.toggle('dark-mode');
        
        if (document.body.classList.contains('dark-mode')) {
            themeIcon.classList.remove('fa-moon');
            themeIcon.classList.add('fa-sun');
            localStorage.setItem('theme', 'dark');
        } else {
            themeIcon.classList.remove('fa-sun');
            themeIcon.classList.add('fa-moon');
            localStorage.setItem('theme', 'light');
        }
    });
}

//Make date in readable date
function formatDate(dateString) {
    if (!dateString) return 'N/A';
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
}

//Notification
function showNotification(message, type = 'info') {
    const notif = document.getElementById("notification");
    if (!notif) {
        // Create notification element if it doesn't exist
        const newNotif = document.createElement('div');
        newNotif.id = 'notification';
        newNotif.className = `notification ${type}`;
        newNotif.textContent = message;
        newNotif.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            padding: 15px;
            border-radius: 5px;
            color: white;
            z-index: 1000;
            display: block;
        `;
        
        if (type === 'success') newNotif.style.backgroundColor = '#28a745';
        else if (type === 'error') newNotif.style.backgroundColor = '#dc3545';
        else if (type === 'warning') newNotif.style.backgroundColor = '#ffc107';
        else newNotif.style.backgroundColor = '#17a2b8';
        
        document.body.appendChild(newNotif);
        
        setTimeout(() => {
            newNotif.style.display = 'none';
            document.body.removeChild(newNotif);
        }, 3000);
        return;
    }
    
    notif.textContent = message;
    notif.className = `notification ${type}`;
    notif.style.display = 'block';
    
    // Set background color based on type
    if (type === 'success') notif.style.backgroundColor = '#28a745';
    else if (type === 'error') notif.style.backgroundColor = '#dc3545';
    else if (type === 'warning') notif.style.backgroundColor = '#ffc107';
    else notif.style.backgroundColor = '#17a2b8';
    
    setTimeout(() => notif.style.display = 'none', 3000);
}

// Check authentication on page load for protected pages
document.addEventListener('DOMContentLoaded', async function() {
    const protectedPages = ['main.html', 'stock.html', 'delivery.html', 'Employee.html', 'reports.html', 'settings.html'];
    const currentPage = window.location.pathname.split('/').pop();
    
    if (protectedPages.includes(currentPage) && currentPage !== 'Login.html') {
        try {
            await checkAuth();
        } catch (error) {
            window.location.href = 'Login.html';
        }
    }
});

// Export functions (for Excel export - these remain the same as they work on client-side data)
function exportStock() {
    // This will be handled by each page's specific implementation
    console.log('Export stock function called - implement in individual pages');
}

function exportDelivery() {
    // This will be handled by each page's specific implementation
    console.log('Export delivery function called - implement in individual pages');
}

function exportEmployee() {
    // This will be handled by each page's specific implementation
    console.log('Export employee function called - implement in individual pages');
}