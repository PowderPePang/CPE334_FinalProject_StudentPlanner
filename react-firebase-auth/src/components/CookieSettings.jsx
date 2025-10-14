import React, { useState } from 'react';
import { Modal, Form, Button } from 'react-bootstrap';

const CookieSettings = ({ show, handleClose, handleSave }) => {
    const [settings, setSettings] = useState({
        necessary: true,
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
        <Modal show={show} onHide={handleClose} centered>
            <Modal.Header closeButton>
                <Modal.Title>Cookie Settings</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form>
                    <Form.Group className="mb-3">
                        <Form.Check
                            type="switch"
                            id="necessary"
                            name="necessary"
                            label="Cookie Necessary"
                            checked={settings.necessary}
                            disabled
                        />
                        <small className="text-muted">Required for website functionality</small>
                    </Form.Group>

                    <Form.Group className="mb-3">
                        <Form.Check
                            type="switch"
                            id="analytics"
                            name="analytics"
                            label="Cookie Analytics"
                            checked={settings.analytics}
                            onChange={handleChange}
                        />
                        <small className="text-muted">Helps analyze website usage</small>
                    </Form.Group>

                    <Form.Group className="mb-3">
                        <Form.Check
                            type="switch"
                            id="marketing"
                            name="marketing"
                            label="Cookie Marketing"
                            checked={settings.marketing}
                            onChange={handleChange}
                        />
                        <small className="text-muted">Used for appropriate advertising</small>
                    </Form.Group>

                    <Form.Group className="mb-3">
                        <Form.Check
                            type="switch"
                            id="preferences"
                            name="preferences"
                            label="Cookie Preferences"
                            checked={settings.preferences}
                            onChange={handleChange}
                        />
                        <small className="text-muted">Remembers your settings</small>
                    </Form.Group>
                </Form>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={handleClose}>
                    Cancel
                </Button>
                <Button variant="primary" onClick={() => handleSave(settings)}>
                    Save Settings
                </Button>
            </Modal.Footer>
        </Modal>
    );
};

export default CookieSettings;