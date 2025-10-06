import React, { useState } from 'react';
import {
  Container,
  Typography,
  Box,
  Card,
  Grid,
  TextField,
  Button,
  Avatar,
  Chip,
  Stack,
  Paper,
  Alert,
} from '@mui/material';
import {
  Phone,
  Email,
  LocationOn,
  Schedule,
  Send,
  CheckCircle,
  LocalDining,
  Support,
  Feedback,
} from '@mui/icons-material';
import { motion } from 'framer-motion';

const Contact: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    // Here you would typically send the form data to your backend
    setTimeout(() => setSubmitted(false), 5000);
  };

  const contactInfo = [
    {
      icon: <Phone />,
      title: 'Phone',
      content: '+1 (555) 123-4567',
      description: 'Mon-Fri 8AM-6PM',
    },
    {
      icon: <Email />,
      title: 'Email',
      content: 'hello@dairyfresh.com',
      description: 'We reply within 24 hours',
    },
    {
      icon: <LocationOn />,
      title: 'Address',
      content: '123 Dairy Lane, Fresh City, FC 12345',
      description: 'Visit our store',
    },
    {
      icon: <Schedule />,
      title: 'Business Hours',
      content: 'Mon-Sat: 7AM-8PM',
      description: 'Sunday: 8AM-6PM',
    },
  ];

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {/* Header */}
        <Box sx={{ textAlign: 'center', mb: 6 }}>
          <Typography
            variant="h3"
            fontWeight={700}
            gutterBottom
            sx={{ fontFamily: 'Poppins, sans-serif' }}
          >
            Get in Touch
          </Typography>
          <Typography
            variant="h6"
            color="text.secondary"
            sx={{ fontFamily: 'Poppins, sans-serif', maxWidth: 600, mx: 'auto' }}
          >
            We'd love to hear from you! Send us a message and we'll respond as soon as possible.
          </Typography>
        </Box>

        <Grid container spacing={4}>
          {/* Contact Information */}
          <Grid item xs={12} md={6}>
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <Typography
                variant="h5"
                fontWeight={600}
                gutterBottom
                sx={{ fontFamily: 'Poppins, sans-serif', mb: 3 }}
              >
                Contact Information
              </Typography>

              <Stack spacing={3}>
                {contactInfo.map((info, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.3 + index * 0.1 }}
                  >
                    <Card
                      elevation={2}
                      sx={{
                        p: 3,
                        borderRadius: 3,
                        transition: 'all 0.3s ease',
                        '&:hover': {
                          boxShadow: 6,
                          transform: 'translateY(-2px)',
                        },
                      }}
                    >
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 3 }}>
                        <Avatar
                          sx={{
                            width: 60,
                            height: 60,
                            background: 'linear-gradient(135deg, #2E7D32 0%, #4CAF50 100%)',
                          }}
                        >
                          {info.icon}
                        </Avatar>
                        <Box>
                          <Typography
                            variant="h6"
                            fontWeight={600}
                            sx={{ fontFamily: 'Poppins, sans-serif' }}
                          >
                            {info.title}
                          </Typography>
                          <Typography
                            variant="body1"
                            sx={{ fontFamily: 'Poppins, sans-serif', mb: 0.5 }}
                          >
                            {info.content}
                          </Typography>
                          <Typography
                            variant="body2"
                            color="text.secondary"
                            sx={{ fontFamily: 'Poppins, sans-serif' }}
                          >
                            {info.description}
                          </Typography>
                        </Box>
                      </Box>
                    </Card>
                  </motion.div>
                ))}
              </Stack>

              {/* Additional Info */}
              <Box sx={{ mt: 4 }}>
                <Typography
                  variant="h6"
                  fontWeight={600}
                  gutterBottom
                  sx={{ fontFamily: 'Poppins, sans-serif' }}
                >
                  Why Choose DairyFresh?
                </Typography>
                <Stack direction="row" spacing={1} flexWrap="wrap" gap={1}>
                  <Chip
                    icon={<LocalDining />}
                    label="100% Organic"
                    variant="outlined"
                    color="primary"
                    sx={{ fontFamily: 'Poppins, sans-serif' }}
                  />
                  <Chip
                    icon={<Support />}
                    label="24/7 Support"
                    variant="outlined"
                    color="secondary"
                    sx={{ fontFamily: 'Poppins, sans-serif' }}
                  />
                  <Chip
                    icon={<CheckCircle />}
                    label="Quality Guaranteed"
                    variant="outlined"
                    color="success"
                    sx={{ fontFamily: 'Poppins, sans-serif' }}
                  />
                </Stack>
              </Box>
            </motion.div>
          </Grid>

          {/* Contact Form */}
          <Grid item xs={12} md={6}>
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
            >
              <Paper
                elevation={4}
                sx={{
                  p: 4,
                  borderRadius: 3,
                  background: 'linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%)',
                }}
              >
                <Typography
                  variant="h5"
                  fontWeight={600}
                  gutterBottom
                  sx={{ fontFamily: 'Poppins, sans-serif', mb: 3 }}
                >
                  Send us a Message
                </Typography>

                {submitted && (
                  <Alert
                    severity="success"
                    icon={<CheckCircle />}
                    sx={{ mb: 3, fontFamily: 'Poppins, sans-serif' }}
                  >
                    Thank you! Your message has been sent successfully.
                  </Alert>
                )}

                <form onSubmit={handleSubmit}>
                  <Stack spacing={3}>
                    <TextField
                      fullWidth
                      label="Your Name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      InputProps={{
                        sx: { fontFamily: 'Poppins, sans-serif' },
                      }}
                      InputLabelProps={{
                        sx: { fontFamily: 'Poppins, sans-serif' },
                      }}
                    />

                    <TextField
                      fullWidth
                      label="Email Address"
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      InputProps={{
                        sx: { fontFamily: 'Poppins, sans-serif' },
                      }}
                      InputLabelProps={{
                        sx: { fontFamily: 'Poppins, sans-serif' },
                      }}
                    />

                    <TextField
                      fullWidth
                      label="Subject"
                      name="subject"
                      value={formData.subject}
                      onChange={handleChange}
                      required
                      InputProps={{
                        sx: { fontFamily: 'Poppins, sans-serif' },
                      }}
                      InputLabelProps={{
                        sx: { fontFamily: 'Poppins, sans-serif' },
                      }}
                    />

                    <TextField
                      fullWidth
                      label="Message"
                      name="message"
                      multiline
                      rows={6}
                      value={formData.message}
                      onChange={handleChange}
                      required
                      InputProps={{
                        sx: { fontFamily: 'Poppins, sans-serif' },
                      }}
                      InputLabelProps={{
                        sx: { fontFamily: 'Poppins, sans-serif' },
                      }}
                    />

                    <Button
                      type="submit"
                      variant="contained"
                      size="large"
                      fullWidth
                      startIcon={<Send />}
                      sx={{
                        py: 1.5,
                        background: 'linear-gradient(45deg, #2E7D32, #4CAF50)',
                        boxShadow: '0 8px 25px rgba(46, 125, 50, 0.3)',
                        fontFamily: 'Poppins, sans-serif',
                        fontWeight: 600,
                        '&:hover': {
                          background: 'linear-gradient(45deg, #1B5E20, #2E7D32)',
                          boxShadow: '0 12px 35px rgba(46, 125, 50, 0.4)',
                        },
                      }}
                    >
                      Send Message
                    </Button>
                  </Stack>
                </form>
              </Paper>
            </motion.div>
          </Grid>
        </Grid>

        {/* FAQ Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.6 }}
        >
          <Box sx={{ mt: 8, textAlign: 'center' }}>
            <Typography
              variant="h5"
              fontWeight={600}
              gutterBottom
              sx={{ fontFamily: 'Poppins, sans-serif' }}
            >
              Frequently Asked Questions
            </Typography>
            <Typography
              variant="body1"
              color="text.secondary"
              sx={{ fontFamily: 'Poppins, sans-serif', mb: 4 }}
            >
              Find quick answers to common questions about our products and services
            </Typography>

            <Grid container spacing={3}>
              {[
                {
                  question: 'What are your delivery hours?',
                  answer: 'We deliver Monday to Saturday, 8AM to 6PM. Sunday deliveries available for premium members.',
                },
                {
                  question: 'How do you ensure product freshness?',
                  answer: 'All our products are sourced directly from local farms and delivered within 24 hours of production.',
                },
                {
                  question: 'Do you offer organic products?',
                  answer: 'Yes! We specialize in 100% organic dairy products certified by leading organic authorities.',
                },
              ].map((faq, index) => (
                <Grid item xs={12} md={4} key={index}>
                  <Card
                    elevation={2}
                    sx={{
                      p: 3,
                      height: '100%',
                      borderRadius: 3,
                      transition: 'all 0.3s ease',
                      '&:hover': {
                        boxShadow: 6,
                        transform: 'translateY(-4px)',
                      },
                    }}
                  >
                    <Avatar
                      sx={{
                        width: 50,
                        height: 50,
                        mb: 2,
                        mx: 'auto',
                        background: 'linear-gradient(135deg, #2E7D32 0%, #4CAF50 100%)',
                      }}
                    >
                      <Feedback />
                    </Avatar>
                    <Typography
                      variant="h6"
                      fontWeight={600}
                      gutterBottom
                      sx={{ fontFamily: 'Poppins, sans-serif' }}
                    >
                      {faq.question}
                    </Typography>
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      sx={{ fontFamily: 'Poppins, sans-serif' }}
                    >
                      {faq.answer}
                    </Typography>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </Box>
        </motion.div>
      </motion.div>
    </Container>
  );
};

export default Contact;
