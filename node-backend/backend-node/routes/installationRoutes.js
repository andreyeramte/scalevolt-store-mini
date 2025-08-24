const express = require('express')
const router = express.Router()
const { supabase } = require('../config/supabase')

// POST /api/installation-orders - Create new installation order
router.post('/', async (req, res) => {
  try {
    const {
      fullName,
      email,
      phone,
      address,
      productName,
      preferredDate,
      notes,
      orderDate
    } = req.body

    // Validate required fields
    if (!fullName || !email || !phone || !address || !productName) {
      return res.status(400).json({
        success: false,
        message: 'Missing required fields: fullName, email, phone, address, productName'
      })
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid email format'
      })
    }

    // Validate phone format (basic validation)
    const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/
    if (!phoneRegex.test(phone.replace(/\s/g, ''))) {
      return res.status(400).json({
        success: false,
        message: 'Invalid phone number format'
      })
    }

    // Insert installation order into Supabase
    const { data, error } = await supabase
      .from('installation_orders')
      .insert([
        {
          full_name: fullName,
          email: email.toLowerCase(),
          phone: phone,
          address: address,
          product_name: productName,
          preferred_date: preferredDate || null,
          notes: notes || null,
          order_date: orderDate,
          status: 'pending'
        }
      ])
      .select()

    if (error) {
      console.error('Supabase error:', error)
      
      // If table doesn't exist, create it
      if (error.code === '42P01') {
        const { error: createError } = await supabase.rpc('create_installation_orders_table')
        if (createError) {
          console.error('Error creating table:', createError)
          return res.status(500).json({
            success: false,
            message: 'Database setup error. Please contact support.'
          })
        }
        
        // Retry insert after table creation
        const { data: retryData, error: retryError } = await supabase
          .from('installation_orders')
          .insert([
            {
              full_name: fullName,
              email: email.toLowerCase(),
              phone: phone,
              address: address,
              product_name: productName,
              preferred_date: preferredDate || null,
              notes: notes || null,
              order_date: orderDate,
              status: 'pending'
            }
          ])
          .select()

        if (retryError) {
          console.error('Retry insert error:', retryError)
          return res.status(500).json({
            success: false,
            message: 'Failed to create installation order'
          })
        }

        return res.status(201).json({
          success: true,
          message: 'Installation order created successfully',
          data: retryData[0]
        })
      }

      return res.status(500).json({
        success: false,
        message: 'Failed to create installation order'
      })
    }

    // Send confirmation email (you can implement this later)
    // await sendInstallationConfirmationEmail(email, fullName, productName)

    res.status(201).json({
      success: true,
      message: 'Installation order created successfully',
      data: data[0]
    })

  } catch (error) {
    console.error('Installation order error:', error)
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    })
  }
})

// GET /api/installation-orders - Get all installation orders (admin only)
router.get('/', async (req, res) => {
  try {
    // TODO: Add authentication middleware
    const { data, error } = await supabase
      .from('installation_orders')
      .select('*')
      .order('order_date', { ascending: false })

    if (error) {
      console.error('Supabase error:', error)
      return res.status(500).json({
        success: false,
        message: 'Failed to fetch installation orders'
      })
    }

    res.json({
      success: true,
      data: data || []
    })

  } catch (error) {
    console.error('Fetch installation orders error:', error)
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    })
  }
})

// GET /api/installation-orders/:id - Get specific installation order
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params

    const { data, error } = await supabase
      .from('installation_orders')
      .select('*')
      .eq('id', id)
      .single()

    if (error) {
      if (error.code === 'PGRST116') {
        return res.status(404).json({
          success: false,
          message: 'Installation order not found'
        })
      }
      
      console.error('Supabase error:', error)
      return res.status(500).json({
        success: false,
        message: 'Failed to fetch installation order'
      })
    }

    res.json({
      success: true,
      data
    })

  } catch (error) {
    console.error('Fetch installation order error:', error)
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    })
  }
})

// PUT /api/installation-orders/:id - Update installation order status
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params
    const { status, notes } = req.body

    // TODO: Add authentication middleware
    if (!status) {
      return res.status(400).json({
        success: false,
        message: 'Status is required'
      })
    }

    const { data, error } = await supabase
      .from('installation_orders')
      .update({
        status,
        notes: notes || null,
        updated_at: new Date().toISOString()
      })
      .eq('id', id)
      .select()

    if (error) {
      console.error('Supabase error:', error)
      return res.status(500).json({
        success: false,
        message: 'Failed to update installation order'
      })
    }

    res.json({
      success: true,
      message: 'Installation order updated successfully',
      data: data[0]
    })

  } catch (error) {
    console.error('Update installation order error:', error)
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    })
  }
})

module.exports = router
