export default class TemplateTypes {
    constructor() {
        this.availableValueTypes = [
            { value: 'geo:point', label: 'Geo' },
            { value: 'float', label: 'Float' },
            { value: 'integer', label: 'Integer' },
            { value: 'string', label: 'String' },
            { value: 'boolean', label: 'Boolean' },
            { value: 'object', label: 'Object' },
        ];
        this.availableTypes = [
            { value: 'dynamic', label: 'Dynamic Value' },
            { value: 'static', label: 'Static Value' },
            { value: 'actuator', label: 'Actuator' },
        ];
        this.configTypes = [
            { value: 'mqtt', label: 'MQTT' },
        ];
        this.configValueTypes = [
            // {"value": "fw_version", "label": "Firmware Version" },
            { value: 'protocol', label: 'Protocol' },
            { value: 'topic', label: 'Topic' },
            { value: 'translator', label: 'Translator' },
            { value: 'device_timeout', label: 'Device Timeout' },
        ];
    }

    getValueTypes() {
        return this.availableValueTypes;
    }

    getTypes() {
        return this.availableTypes;
    }

    getConfigValueTypes() {
        return this.configValueTypes;
    }

    getConfigTypes() {
        return this.configTypes;
    }
}
