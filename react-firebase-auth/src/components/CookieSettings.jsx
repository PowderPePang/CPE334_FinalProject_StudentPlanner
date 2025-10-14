import React, { useState } from 'react';
import { Modal, Form, Button } from 'react-bootstrap';

const CookieSettings = ({ show, handleClose, handleSave }) => {
    const [settings, setSettings] = useState({
        necessary: true, // Always true and disabled
        analytics: false,
        marketing: false,
        preferences: false
    });

    const handleChange = (e) => {
        setSettings({
            ...settings,
            [e.target.name]: e.target.checked
        });
    };

    return (
        <Modal show={show} onHide={handleClose}>
            <Modal.Header closeButton>
                <Modal.Title>Cookie Setting</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form>
                    <Form.Group className="mb-3">
                        <Form.Check
                            type="switch"
                            id="necessary"
                            name="necessary"
                            label="Cookie necessary"
                            checked={settings.necessary}
                            disabled
                        />
                        <small className="text-muted">Necessary for the website to function.</small>
                    </Form.Group>

                    <Form.Group className="mb-3">
                        <Form.Check
                            type="switch"
                            id="analytics"
                            name="analytics"
                            label="Cookie analytics"
                            checked={settings.analytics}
                            onChange={handleChange}
                        />
                        <small className="text-muted">Help analyze website usage.</small>
                    </Form.Group>

                    <Form.Group className="mb-3">
                        <Form.Check
                            type="switch"
                            id="marketing"
                            name="marketing"
                            label="Cookie marketing"
                            checked={settings.marketing}
                            onChange={handleChange}
                        />
                        <small className="text-muted">Used for personalized advertising.</small>
                    </Form.Group>

                    <Form.Group className="mb-3">
                        <Form.Check
                            type="switch"
                            id="preferences"
                            name="preferences"
                            label="Cookie preferences"
                            checked={settings.preferences}
                            onChange={handleChange}
                        />
                        <small className="text-muted">Remember your settings.</small>
                    </Form.Group>
                </Form>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={handleClose}>
                    Close
                </Button>
                <Button variant="primary" onClick={() => handleSave(settings)}>
                    Save your settings
                </Button>
            </Modal.Footer>
        </Modal>
    );
};

export default CookieSettings;