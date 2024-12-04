import {
  AppProvider,
  Page,
  Layout,
  Card,
  Button,
  Text,
  List,
  Badge,
  Grid,
  Icon,
  BlockStack,
  Form,
  FormLayout,
  TextField,
  Select,
  Modal,
  Toast,
  Frame,
} from "@shopify/polaris";
import "@shopify/polaris/build/esm/styles.css";
import enTranslations from "@shopify/polaris/locales/en.json";
import TagManager from "react-gtm-module";
import { useEffect, useState, useCallback } from "react";
import { Car, Engine, GasPump, Speedometer } from "@phosphor-icons/react";

// Declare global dataLayer and gtag
declare global {
  interface Window {
    dataLayer: any[];
    gtag: (...args: any[]) => void;
  }
}

// GTM configuration
const tagManagerArgs = {
  gtmId: "GTM-MBB4RX9S", // Replace with your actual GTM ID
};

// Vehicle data
const vehicleData = {
  make: "Example Make",
  model: "Example Model",
  year: "2024",
  trim: "Luxury Edition",
  price: "$45,999",
  specs: {
    engine: "3.0L V6 Twin-Turbo",
    horsepower: "400 hp",
    transmission: "8-Speed Automatic",
    fuelEconomy: "22 city / 30 highway",
    acceleration: "0-60 mph in 4.5s",
  },
};

interface ContactFormData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  preferredContact: string;
  message: string;
}

function App() {
  const [contactModalActive, setContactModalActive] = useState(false);
  const [toastActive, setToastActive] = useState(false);
  const [formData, setFormData] = useState<ContactFormData>({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    preferredContact: "email",
    message: "",
  });
  const [formErrors, setFormErrors] = useState<Partial<ContactFormData>>({});

  useEffect(() => {
    TagManager.initialize(tagManagerArgs);
  }, []);

  const validateForm = (): boolean => {
    const errors: Partial<ContactFormData> = {};

    if (!formData.firstName.trim()) errors.firstName = "First name is required";
    if (!formData.lastName.trim()) errors.lastName = "Last name is required";
    if (!formData.email.trim()) {
      errors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      errors.email = "Invalid email format";
    }
    if (!formData.phone.trim()) {
      errors.phone = "Phone number is required";
    } else if (!/^\+?[\d\s-]{10,}$/.test(formData.phone.replace(/\s+/g, ""))) {
      errors.phone = "Invalid phone number";
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleContactSubmit = () => {
    if (validateForm()) {
      // Send enhanced conversion data to Google Ads
      window.gtag?.("event", "conversion", {
        send_to: "AW-CONVERSION_ID/CONVERSION_LABEL",
        email: formData.email,
        phone_number: formData.phone,
        first_name: formData.firstName,
        last_name: formData.lastName,
      });

      // Send event to GTM
      window.dataLayer?.push({
        event: "contact_form_submission",
        contact_type: "detailed_inquiry",
        dealer: {
          id: "dealer123",
          name: "Example Dealer",
        },
        customer: {
          firstName: formData.firstName,
          lastName: formData.lastName,
          preferredContact: formData.preferredContact,
        },
      });

      // Close modal and reset form
      setContactModalActive(false);
      setFormData({
        firstName: "",
        lastName: "",
        email: "",
        phone: "",
        preferredContact: "email",
        message: "",
      });
      setToastActive(true);
    }
  };

  const handleTestDrive = () => {
    window.dataLayer?.push({
      event: "test_drive_request",
      vehicle: {
        make: vehicleData.make,
        model: vehicleData.model,
        year: vehicleData.year,
        trim: vehicleData.trim,
      },
      dealer: {
        id: "dealer123",
        name: "Example Dealer",
      },
    });
  };

  const toggleToast = useCallback(
    () => setToastActive((active) => !active),
    []
  );

  const toastMarkup = toastActive ? (
    <Toast
      content="Thank you for your inquiry. A dealer representative will contact you shortly."
      onDismiss={toggleToast}
    />
  ) : null;

  const contactModal = (
    <Modal
      open={contactModalActive}
      onClose={() => setContactModalActive(false)}
      title="Contact Dealer"
      primaryAction={{
        content: "Submit",
        onAction: handleContactSubmit,
      }}
      secondaryActions={[
        {
          content: "Cancel",
          onAction: () => setContactModalActive(false),
        },
      ]}
    >
      <Modal.Section>
        <Form onSubmit={handleContactSubmit}>
          <FormLayout>
            <FormLayout.Group>
              <TextField
                label="First Name"
                value={formData.firstName}
                onChange={(value) =>
                  setFormData({ ...formData, firstName: value })
                }
                error={formErrors.firstName}
                autoComplete="given-name"
              />
              <TextField
                label="Last Name"
                value={formData.lastName}
                onChange={(value) =>
                  setFormData({ ...formData, lastName: value })
                }
                error={formErrors.lastName}
                autoComplete="family-name"
              />
            </FormLayout.Group>
            <TextField
              label="Email"
              type="email"
              value={formData.email}
              onChange={(value) => setFormData({ ...formData, email: value })}
              error={formErrors.email}
              autoComplete="email"
            />
            <TextField
              label="Phone"
              type="tel"
              value={formData.phone}
              onChange={(value) => setFormData({ ...formData, phone: value })}
              error={formErrors.phone}
              autoComplete="tel"
            />
            <Select
              label="Preferred Contact Method"
              options={[
                { label: "Email", value: "email" },
                { label: "Phone", value: "phone" },
              ]}
              value={formData.preferredContact}
              onChange={(value) =>
                setFormData({ ...formData, preferredContact: value })
              }
            />
            <TextField
              label="Message"
              value={formData.message}
              onChange={(value) => setFormData({ ...formData, message: value })}
              multiline={4}
              autoComplete="off"
            />
          </FormLayout>
        </Form>
      </Modal.Section>
    </Modal>
  );

  return (
    <AppProvider i18n={enTranslations}>
      <Frame>
        <Page title="Automotive Dealership">
          <Layout>
            <Layout.Section>
              <BlockStack gap="4">
                <Card>
                  <div style={{ padding: "1rem" }}>
                    <BlockStack gap="4">
                      <div>
                        <Text variant="headingLg" as="h2">
                          {vehicleData.year} {vehicleData.make}{" "}
                          {vehicleData.model}
                        </Text>
                        <Badge tone="success">{vehicleData.trim}</Badge>
                      </div>

                      <Text variant="headingXl" as="p" fontWeight="bold">
                        {vehicleData.price}
                      </Text>

                      <Text as="p">
                        Experience unparalleled luxury and performance in our
                        latest model.
                      </Text>

                      <Grid>
                        <Grid.Cell columnSpan={{ xs: 6, sm: 3, md: 3, lg: 3 }}>
                          <BlockStack gap="2" alignment="center">
                            <Icon source={Car} />
                            <Text as="span">{vehicleData.specs.engine}</Text>
                          </BlockStack>
                        </Grid.Cell>
                        <Grid.Cell columnSpan={{ xs: 6, sm: 3, md: 3, lg: 3 }}>
                          <BlockStack gap="2" alignment="center">
                            <Icon source={Engine} />
                            <Text as="span">
                              {vehicleData.specs.horsepower}
                            </Text>
                          </BlockStack>
                        </Grid.Cell>
                        <Grid.Cell columnSpan={{ xs: 6, sm: 3, md: 3, lg: 3 }}>
                          <BlockStack gap="2" alignment="center">
                            <Icon source={GasPump} />
                            <Text as="span">
                              {vehicleData.specs.fuelEconomy}
                            </Text>
                          </BlockStack>
                        </Grid.Cell>
                        <Grid.Cell columnSpan={{ xs: 6, sm: 3, md: 3, lg: 3 }}>
                          <BlockStack gap="2" alignment="center">
                            <Icon source={Speedometer} />
                            <Text as="span">
                              {vehicleData.specs.acceleration}
                            </Text>
                          </BlockStack>
                        </Grid.Cell>
                      </Grid>

                      <div style={{ marginTop: "1rem" }}>
                        <BlockStack gap="2">
                          <Button
                            variant="primary"
                            onClick={handleTestDrive}
                            fullWidth
                          >
                            Schedule Test Drive
                          </Button>
                          <Button
                            onClick={() => setContactModalActive(true)}
                            fullWidth
                          >
                            Contact Dealer
                          </Button>
                        </BlockStack>
                      </div>
                    </BlockStack>
                  </div>
                </Card>

                <Card>
                  <div style={{ padding: "1rem" }}>
                    <BlockStack gap="4">
                      <Text variant="headingMd" as="h3">
                        Key Features
                      </Text>
                      <List type="bullet">
                        <List.Item>
                          Premium leather interior with heated and ventilated
                          seats
                        </List.Item>
                        <List.Item>
                          12.3-inch digital instrument cluster
                        </List.Item>
                        <List.Item>
                          Panoramic sunroof with power shade
                        </List.Item>
                        <List.Item>
                          Advanced driver assistance systems
                        </List.Item>
                        <List.Item>
                          Premium audio system with 15 speakers
                        </List.Item>
                      </List>
                    </BlockStack>
                  </div>
                </Card>
              </BlockStack>
            </Layout.Section>
          </Layout>
        </Page>
        {contactModal}
        {toastMarkup}
      </Frame>
    </AppProvider>
  );
}

export default App;
