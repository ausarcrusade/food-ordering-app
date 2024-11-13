import nodemailer from 'nodemailer';

export async function sendOrderConfirmationEmail({ email, orderNumber, orderDetails }) {
    // Create test account if no email credentials
    let testAccount;
    if (!process.env.EMAIL_HOST) {
        testAccount = await nodemailer.createTestAccount();
    }

    const transporter = nodemailer.createTransport({
        host: 'smtp.gmail.com',
        port: 465,
        secure: true, // Use SSL/TLS
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASSWORD, // Use App Password here
        }
    });

    const getEstimatedTimes = (isDelivery) => {
        const now = new Date();
        const minMinutes = isDelivery ? 30 : 20;
        const maxMinutes = isDelivery ? 45 : 30;
        
        const minTime = new Date(now);
        const maxTime = new Date(now);
        
        minTime.setMinutes(minTime.getMinutes() + minMinutes);
        maxTime.setMinutes(maxTime.getMinutes() + maxMinutes);
        
        return {
            minTime: minTime.toLocaleTimeString('en-US', {
                hour: 'numeric',
                minute: '2-digit',
                hour12: true
            }),
            maxTime: maxTime.toLocaleTimeString('en-US', {
                hour: 'numeric',
                minute: '2-digit',
                hour12: true
            })
        };
    };

    const { minTime, maxTime } = getEstimatedTimes(orderDetails.deliveryOption === 'delivery');

    try {
        const info = await transporter.sendMail({
            from: process.env.EMAIL_FROM || `"Pasta Express" <${process.env.EMAIL_USER}>`,
            to: email,
            subject: `Order Confirmation #${orderNumber}`,
            html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
                    <div style="text-align: center; background-color: #FF5733; padding: 20px; border-radius: 8px;">
                        <h1 style="color: white; margin: 0;">Thank you for your order!</h1>
                    </div>
                    
                    <div style="background-color: #fff; padding: 20px; border-radius: 8px; margin-top: 20px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
                        <p style="font-size: 18px; color: #333; text-align: center;">Your order <span style="color: #FF5733; font-weight: bold;">#${orderNumber}</span> has been confirmed.</p>
                        
                        <p style="text-align: center; font-size: 16px; color: #666; margin: 15px 0;">
                            Estimated ${orderDetails.deliveryOption === 'delivery' ? 'Delivery' : 'Collection'} Time:<br>
                            <strong style="color: #FF5733; font-size: 18px;">${minTime} - ${maxTime}</strong>
                        </p>

                        <div style="margin: 30px 0; background-color: #f8f8f8; padding: 20px; border-radius: 8px;">
                            <h2 style="color: #FF5733; margin-top: 0; text-align: center;">Order Details</h2>
                            <ul style="list-style: none; padding: 0;">
                                ${orderDetails.items.map(item => `
                                    <li style="margin-bottom: 20px; padding: 15px; border: 1px solid #eee; border-radius: 8px; background-color: #fff; text-align: center;">
                                        <div style="display: flex; flex-direction: column; gap: 8px;">
                                            <div style="text-align: left;">
                                                <div style="font-weight: bold; font-size: 18px; color: #333;">
                                                    ${item.quantity}x ${item.title}
                                                </div>
                                                ${item.addOns && item.addOns.length > 0 
                                                    ? `<div style="color: #666; font-size: 13px;">
                                                        with ${item.addOns.map(addon => addon.name).join(', ')}
                                                       </div>` 
                                                    : ''}
                                            </div>
                                            
                                            <div style="background-color: #f8f8f8; padding: 8px 12px; border-radius: 4px; display: inline-block; margin-left: auto;">
                                                <div style="color: #666; font-size: 13px;">
                                                    Price per item: <span style="font-weight: 500;">$${item.price.toFixed(2)}</span>
                                                </div>
                                                <div style="color: #FF5733; font-weight: bold; font-size: 14px; border-top: 1px solid #eee; padding-top: 6px; margin-top: 6px;">
                                                    Item Total: $${(item.price * item.quantity).toFixed(2)}
                                                </div>
                                            </div>
                                        </div>
                                    </li>
                                `).join('')}
                            </ul>
                            
                            <div style="text-align: right; margin-top: 20px; padding-top: 15px; border-top: 2px solid #eee;">
                                <p style="font-size: 18px; font-weight: bold;">
                                    Total: <span style="color: #FF5733;">$${orderDetails.total.toFixed(2)}</span>
                                </p>
                            </div>
                        </div>
                        
                        <div style="background-color: #f8f8f8; padding: 20px; border-radius: 8px; margin-top: 20px; text-align: center;">
                            <h2 style="color: #FF5733; margin-top: 0;">
                                ${orderDetails.deliveryOption === 'delivery' ? 'Delivery' : 'Collection'} Details
                            </h2>
                            ${orderDetails.deliveryOption === 'delivery' 
                                ? `<p style="font-size: 16px; color: #333;">
                                    <strong>Delivering to:</strong><br>
                                    ${orderDetails.address.street}<br>
                                    ${orderDetails.address.city}<br>
                                    ${orderDetails.address.postalCode}
                                    ${orderDetails.address.instructions 
                                        ? `<br><br><strong>Instructions:</strong><br>${orderDetails.address.instructions}`
                                        : ''}
                                   </p>`
                                : `<p style="font-size: 16px; color: #333;">
                                    <strong>Collection from:</strong><br>
                                    Pasta Express<br>
                                    NTU North Spine<br>
                                    Singapore 639798
                                   </p>`
                            }
                        </div>
                    </div>
                    
                    <div style="text-align: center; margin-top: 20px; color: #666; font-size: 14px;">
                        <p>Questions about your order?<br>Contact us at support@pastaexpress.com</p>
                    </div>
                </div>
            `,
        });

        console.log('Email sent:', info.messageId);
        if (testAccount) {
            console.log('Preview URL:', nodemailer.getTestMessageUrl(info));
        }
    } catch (error) {
        console.error('Email sending error:', error);
        throw error;
    }
}
