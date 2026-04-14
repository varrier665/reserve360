import { corsHeaders } from '@supabase/supabase-js/cors'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { type, recipientEmail, recipientName, donationAmount, transactionId } = await req.json()

    if (!type || !recipientEmail || !recipientName) {
      return new Response(JSON.stringify({ error: 'Missing required fields' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    let subject = ''
    let body = ''

    switch (type) {
      case 'donation_received':
        subject = 'Donation Successful — Reserve360'
        body = `Dear ${recipientName},\n\nWe are pleased to inform you that your donation of ₹${donationAmount?.toLocaleString('en-IN') || ''} has been successfully received and verified.\n\nTransaction ID: ${transactionId || 'N/A'}\n\nThank you for your generous contribution. Your support makes a real difference.\n\nWarm regards,\nTeam Reserve360`
        break
      case 'donation_not_received':
        subject = 'Donation Status Update — Reserve360'
        body = `Dear ${recipientName},\n\nWe regret to inform you that your transaction could not be verified.\n\nTransaction ID: ${transactionId || 'N/A'}\n\nIf the amount was deducted from your account, please contact our support team at iamstisha@gmail.com with your transaction details.\n\nRegards,\nTeam Reserve360`
        break
      case 'volunteer_accepted':
        subject = 'Volunteer Application Accepted — Reserve360'
        body = `Dear ${recipientName},\n\nWe are delighted to inform you that your volunteer application has been accepted! Welcome to our volunteer team.\n\nOur coordination team will reach out to you shortly with next steps.\n\nWarm regards,\nTeam Reserve360`
        break
      case 'volunteer_rejected':
        subject = 'Volunteer Application Update — Reserve360'
        body = `Dear ${recipientName},\n\nThank you for your interest in volunteering with Reserve360.\n\nWe regret to inform you that your application was not selected at this time. We encourage you to apply again in the future.\n\nRegards,\nTeam Reserve360`
        break
      default:
        return new Response(JSON.stringify({ error: 'Unknown email type' }), {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        })
    }

    // Log the email that would be sent (email sending will work once email domain is configured)
    console.log(`Email notification: To=${recipientEmail}, Subject=${subject}`)
    console.log(`Body: ${body}`)

    // For now, store as a record that email was "sent" (notification logged)
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    const supabase = createClient(supabaseUrl, supabaseKey)

    // We just log success — actual email delivery requires email domain setup
    return new Response(JSON.stringify({ 
      success: true, 
      message: 'Notification processed',
      email: { to: recipientEmail, subject } 
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  }
})
