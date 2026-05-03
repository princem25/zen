/**
 * Generates a WhatsApp redirect URL for an order
 * @param {Object} product - The product being purchased
 * @param {number} qty - The quantity
 * @param {Object} address - The customer shipping details
 * @returns {string} The encoded WhatsApp URL
 */
export const BUSINESS_PHONE = "919714203627";

export const generateWhatsAppOrderLink = (product, qty, address) => {
    const PHONE_NUMBER = BUSINESS_PHONE;
    
    const totalPrice = Number(product.price) * qty;
    
    const fullAddress = `${address.addressLine}, ${address.city}, ${address.state} - ${address.pincode}`;

    const productLink = `${window.location.origin}/product/${product.id}`;

    const message = `Order Details:
Product: ${product.name}
Price: ₹${Number(product.price).toLocaleString('en-IN')}
Quantity: ${qty}
Total: ₹${totalPrice.toLocaleString('en-IN')}
Link: ${productLink}

Customer Details:
Name: ${address.name}
Phone: ${address.phone}
Address: ${fullAddress}`;

    const encodedMessage = encodeURIComponent(message);
    return `https://wa.me/${PHONE_NUMBER}?text=${encodedMessage}`;
};
