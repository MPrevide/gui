/* eslint-disable */
import React, { Component } from 'react';
import { hashHistory } from 'react-router';
import AltContainer from 'alt-container';
import { NewPageHeader } from '../../containers/full/PageHeader';
import MeasureStore from '../../stores/MeasureStore';
import MeasureActions from '../../actions/MeasureActions';
import DeviceActions from '../../actions/DeviceActions';
import DeviceStore from '../../stores/DeviceStore';
import util from '../../comms/util/util';
import { Loading } from '../../components/Loading';
import { Attr, HandleGeoElements } from '../../components/HistoryElements';
import toaster from '../../comms/util/materialize';
import { DojotBtnRedCircle } from '../../components/DojotButton';
import { RemoveModal } from '../../components/Modal';
import ConfigStore from '../../stores/ConfigStore';
import { withNamespaces } from 'react-i18next';
import * as i18next from 'i18next';

const DeviceHeader = ({ device, t }) => (
    <div className="row devicesSubHeader p0 device-details-header">
        <div className="col s8 m8">
            <label className="col s12 device-label truncate" title={device.label}>
                {device.label}
            </label>
            <div className="col s12 device-label-name">{t('text.name')}</div>
        </div>
    </div>
);


class Attribute extends Component {
    constructor(props) {
        super(props);
        this.state = {
            opened: false,
        };
        this.toogleExpand = this.toogleExpand.bind(this);
    }

    componentDidMount() {
        //  MeasureActions.fetchMeasure(this.props.device, this.props.device.id, this.props.device.templates, this.props.attr.id, 250);
    }

    toogleExpand(state) {
        this.setState({ opened: state });
    }

    render() {
        // check the current window, if less then 1024px, blocks compressed state
        let opened = util.checkWidthToStateOpen(this.state.opened);
        return (
            <div className={`attributeBox ${opened ? 'expanded' : 'compressed'}`}>
                <div className="header">
                    <label>{this.props.attr.label}</label>
                    {!opened ?
                        <i onClick={this.toogleExpand.bind(this, true)} className="fa fa-expand"/> :
                        <i onClick={this.toogleExpand.bind(this, false)}
                           className="fa fa-compress"/>}
                </div>
                <div className="details-card-content">
                    <AttrHistory device={this.props.device} type={this.props.attr.value_type}
                                 attr={this.props.attr.label}/>
                </div>
            </div>
        );
    }
}


class Configurations extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        const { t } = this.props;
        return (
            <div>
                <GenericList img="images/gear-dark.png" attrs={this.props.attrs}
                             box_title={t('text.configuration')} device={this.props.device} t={ t }/>
            </div>
        );
    }
}

class StaticAttributes extends Component {
    constructor(props) {
        super(props);

        this.openStaticMap = this.openStaticMap.bind(this);
    }

    openStaticMap(state) {
        this.props.openStaticMap(state);
    }

    render() {
        const { t } = this.props;
        return (
            <div>
                <GenericList img="images/tag.png" attrs={this.props.attrs}
                             box_title={t('text.static_attributes')} device={this.props.device}
                             openStaticMap={this.openStaticMap} t={t}/>
            </div>
        );
    }
}

class GenericList extends Component {
    constructor(props) {
        super(props);
        this.state = {
            openStaticMap: true,
            visible_static_map: false,
            truncate: false
        };

        this.openMap = this.openMap.bind(this);
        this.verifyIsGeo = this.verifyIsGeo.bind(this);
        this.limitSizeField = this.limitSizeField.bind(this);
    }

    componentWillMount() {
        this.limitSizeField(this.props.attrs);
    }

    openMap(visible) {
        const device = this.props.device;
        for (const k in device.attrs) {
            for (const j in device.attrs[k]) {
                if (device.attrs[k][j].value_type === 'geo:point') {
                    if (device.attrs[k][j].static_value !== '') {
                        this.setState({
                            openStaticMap: !this.state.openStaticMap,
                            visible_static_map: !this.state.visible_static_map,
                        });
                        this.props.openStaticMap(this.state.openStaticMap);
                    }
                }
            }
        }
    }

    verifyIsGeo(attrs) {
        for (const k in attrs) {
            if (attrs[k].value_type === 'geo:point' || attrs[k].value_type === 'geo') {
                attrs[k].isGeo = true;
            } else {
                attrs[k].isGeo = false;
            }
        }
    }

    limitSizeField(attrs) {
        attrs.map((attr) => {
            if (attr.static_value !== undefined) {
                if (attr.type === 'meta') {
                    // values of configurations
                    if (attr.static_value.length > 20) {
                        this.setState({ truncate: true });
                    }
                } else {
                    if (attr.label.length > 20 || attr.value_type > 20) {
                        this.setState({ truncate: true });
                    }
                    // Values of static attributes
                    if (attr.static_value.length > 20) {
                        this.setState({ truncate: true });
                    }
                }
            }
        });
    }

    render() {
        const { t } = this.props;
        this.verifyIsGeo(this.props.attrs);
        return (
            <div className="row stt-attributes">
                <div className="col s12 header">
                    <div className="icon">
                        <img src={this.props.img}/>
                    </div>
                    <label>{this.props.box_title}</label>
                </div>
                <div className="col s12 body">
                    {this.props.box_title == 'Configurations' ? (
                        <div key="id" className="line display-flex">
                            <div className="col s12 pr0">
                                <div className="col s5">
                                    <div className="name-value">device id</div>
                                    <div className="value-label">Name</div>
                                </div>
                                <div className="col s7 p0 text-right">
                                    <div className="value-value pr0">{this.props.device.id}</div>
                                    <div className="value-label pr0">STRING</div>
                                </div>
                            </div>
                        </div>
                    ) : ('')}
                    {this.props.attrs.map(attr => (
                        attr.isGeo ? (
                            <div key={attr.label} className="line col s12 pl30"
                                 id="static-geo-attribute" onClick={this.openMap}>
                                <div className="display-flex-column flex-1">
                                    <div className={this.state.truncate ?
                                        'name-value display-flex flex-1 space-between truncate' :
                                        'name-value display-flex flex-1 space-between'}
                                         title= {i18next.exists(`options.config_type.values.${attr.label}`) ? t(`options.config_type.values.${attr.label}`) : `${attr.label}`}
                                    >
                                        {i18next.exists(`options.config_type.values.${attr.label}`) ? t(`options.config_type.values.${attr.label}`) : `${attr.label}`}
                                        <div className="star">
                                            <i className={`fa ${this.state.visible_static_map ? 'fa-star' : 'fa-star-o'}`}/>
                                        </div>
                                    </div>
                                    <div className="display-flex-no-wrap space-between">
                                        <div
                                            className={this.state.truncate ? 'value-value truncate' : 'value-value'}
                                            title={attr.static_value}>
                                            {attr.static_value.length > 25 ?
                                                attr.static_value.substr(1, 22) + '...' :
                                                attr.static_value
                                            }
                                        </div>
                                        <div className="value-label"
                                             title={attr.value_type}>
                                            {i18next.exists(`types.${attr.value_type}`) ? t(`types.${attr.value_type}`) : attr.value_type}
                                            </div>
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <div key={attr.label} className="line col s12 pl30">
                                <div className="display-flex-column flex-1">
                                    <div
                                        className={this.state.truncate ? 'name-value  truncate' : 'name-value '}
                                        title= {i18next.exists(`options.config_type.values.${attr.label}`) ? t(`options.config_type.values.${attr.label}`) : `${attr.label}`}>{i18next.exists(`options.config_type.values.${attr.label}`) ? t(`options.config_type.values.${attr.label}`) : `${attr.label}`}</div>
                                    <div className="display-flex-no-wrap space-between">
                                        <div
                                            className={this.state.truncate ? 'value-value  truncate' : 'value-value '}
                                            title={attr.static_value}>
                                            {(attr.static_value !== undefined && attr.static_value.length > 25) ?
                                                attr.static_value.substr(1, 22) + '...' :
                                                attr.static_value
                                            }
                                        </div>
                                        <div className="value-label"
                                             title={attr.value_type}>
                                            {i18next.exists(`types.${attr.value_type}`) ? t(`types.${attr.value_type}`) : attr.value_type}
                                            </div>
                                    </div>
                                </div>
                            </div>
                        )
                    ))}
                </div>
            </div>
        );
    }
}


class DyAttributeArea extends Component {
    constructor(props) {
        super(props);
        this.state = {
            selected_attributes: [],
            visible_attributes: {},
            static_geo_attr_label: ''
        };
        this.toggleAttribute = this.toggleAttribute.bind(this);
    }

    componentWillMount() {
        // Get static geo attr label
        for (const k in this.props.device.attrs) {
            for (const j in this.props.device.attrs[k]) {
                if (this.props.device.attrs[k][j].isGeo) {
                    if (this.props.device.attrs[k][j].type == 'static') {
                        this.setState({ static_geo_attr_label: this.props.device.attrs[k][j].label });
                    }
                }
            }
        }
    }

    toggleAttribute(attr) {
        let sa = this.state.selected_attributes;
        const current_attrs = this.state.visible_attributes;
        if (current_attrs[attr.id]) {
            sa = sa.filter(i => i.id !== attr.id);
            delete current_attrs[attr.id];
        } else {
            sa.push(attr);
            current_attrs[attr.id] = true;
        }

        // iterate over attrs
        this.setState({
            selected_attributes: sa,
            visible_attributes: current_attrs,
        });
    }

    render() {
        const lista = this.props.attrs;
        for (const index in lista) {
            if (this.state.visible_attributes[lista[index].id]) {
                lista[index].visible = true;
            } else {
                lista[index].visible = false;
            }
        }

        const { t } = this.props;
        return (
            <div className="content-row">
                <div className="second-col">
                    {this.state.selected_attributes.length == 0 && this.props.openStaticMap == false
                        ? (<div
                            className="second-col-label center-align">{t('devices:select_attribute')}</div>)
                        : null
                    }
                    {this.props.openStaticMap ? <HandleGeoElements device={this.props.device}
                                                                   label={this.state.static_geo_attr_label}
                                                                   isStatic/> : null}
                    {this.state.selected_attributes.map(at => (
                        <Attribute key={at.id} device={this.props.device} attr={at}/>
                    ))}
                </div>
                <div className="third-col">
                    <div className="row">
                        <DynamicAttributeList device={this.props.device} attrs={lista}
                                              change_attr={this.toggleAttribute} t={t}/>
                    </div>
                    <div className="row">
                        <ActuatorsArea actuators={this.props.actuators} t={t}/>
                    </div>
                </div>
            </div>
        );
    }
}

class ActuatorsArea extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        const { t } = this.props;
        return (
            <div className=" dy_attributes">
                <div className="col s12 header">
                    <div className="col s2"/>
                    <label className="col s8">{t('text.actuators')}</label>
                </div>
                <div className="col s12 body">
                    {this.props.actuators.map(actuator => (
                        <div key={actuator.label} className="line">
                            <div className="col offset-s2 s8">
                                <div className="label truncate"
                                     title={actuator.label}>{actuator.label}</div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        );
    }
}

class DynamicAttributeList extends Component {
    constructor(props) {
        super(props);
        this.state = { truncate: false };
        this.clickAttr = this.clickAttr.bind(this);
        this.limitSizeField = this.limitSizeField.bind(this);
    }

    componentWillMount() {
        const device = this.props.device;
        for (const i in device.attrs) {
            for (const j in device.attrs[i]) {
                if (device.attrs[i][j].type !== 'meta') {
                    if (device.attrs[i][j].type === 'dynamic') {
                        if (device.attrs[i][j].value_type === 'geo:point') {
                            MeasureActions.fetchPosition.defer(device, device.id, device.attrs[i][j].label);
                        }
                    }
                    MeasureActions.fetchMeasure.defer(device, device.attrs[i][j].label, 10);
                }
            }
        }

        this.limitSizeField(this.props.attrs);
    }

    clickAttr(attr) {
        this.props.change_attr(attr);
    }

    limitSizeField(dyAttrs) {
        dyAttrs.map((dyAttr) => {
            if (dyAttr.label.length > 20) {
                this.setState({ truncate: true });
            }
        });
    }

    render() {
        const { t } = this.props;
        return (
            <div className=" dy_attributes">
                <div className="col s12 header">
                    <div className="col s2 filter-icon">
                    </div>
                    <label className="col s10">{t('devices:dynamic_attributes')}</label>
                </div>
                <div className="col s12 body">
                    {this.props.attrs.map(attr => (
                        <div key={attr.label} className="line"
                             onClick={this.clickAttr.bind(this, attr)}>
                            <div className="col offset-s2 s8">
                                <div className={this.state.truncate ? 'label truncate' : 'label'}
                                     title= {i18next.exists(`options.config_type.values.${attr.label}`) ? t(`options.config_type.values.${attr.label}`) : `${attr.label}`}>  {i18next.exists(`options.config_type.values.${attr.label}`) ? t(`options.config_type.values.${attr.label}`) : `${attr.label}`}</div>
                                <div
                                    className="value-label">{i18next.exists(`types.${attr.value_type}`) ? t(`types.${attr.value_type}`) : attr.value_type}</div>
                            </div>
                            <div className="col s2">
                                <div className="star">
                                    <i className={`fa ${attr.visible ? 'fa-star' : 'fa-star-o'}`}/>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        );
    }
}


class DeviceUserActions extends Component {
    constructor(props) {
        super(props);
        this.removeDevice = this.removeDevice.bind(this);
    }

    removeDevice(event) {
        this.props.setModal(true);
    }

    render() {
        const { t } = this.props;
        return (
            <div>
                <DojotBtnRedCircle
                    to="/device/list"
                    icon="fa fa-arrow-left"
                    tooltip={t('devices:return_list')}
                />
            </div>
        );
    }
}


class AttrHistory extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div className="graphLarge">
                <AltContainer stores={{
                    MeasureStore: MeasureStore,
                    Config: ConfigStore
                }}>
                    <Attr device={this.props.device} type={this.props.type} attr={this.props.attr}
                          label={this.props.attr} isStatic={false}/>
                </AltContainer>
            </div>
        );
    }
}

function getAttrsLength(attrs) {
    let length = 0;
    for (const k in attrs) {
        length += attrs[k].length;
    }
    return length;
}

function StatusDisplay(props) {
    const numAttributes = getAttrsLength(props.device.attrs);
    return (
        <div className="detail-box-body">
            <div className="metric">
                <span className="label">Attributes</span>
                <span className="value">{numAttributes}</span>
            </div>
            <div className="metric">
                <span className="label">Last update</span>
                <span className="value">{util.iso_to_date(props.device.ts)}</span>
            </div>
            <div className="metric">
                <span className="label">Location</span>
                <span className="value">{props.location}</span>
            </div>
            <div className="metric">
                <span className="label">Protocol</span>
                <span
                    className="value">{props.device.protocol ? props.device.protocol : 'MQTT'}</span>
            </div>
        </div>
    );
}

class DeviceDetail extends Component {
    constructor(props) {
        super(props);
        this.state = { openStaticMap: false };

        this.openStaticMap = this.openStaticMap.bind(this);
    }

    openStaticMap(state) {
        this.setState({ openStaticMap: state });
    }

    render() {
        let attr_list = [];
        let dal = [];
        let actuators = [];
        let config_list = [];
        for (const index in this.props.device.attrs) {
            let tmp = this.props.device.attrs[index];
            if (!Array.isArray(tmp)) {
                tmp = this.props.device.attrs;
            }

            attr_list = attr_list.concat(tmp.filter(i => String(i.type) === 'static'));
            dal = dal.concat(tmp.filter((i) => {
                i.visible = false;
                return String(i.type) === 'dynamic';
            }));
            actuators = actuators.concat(tmp.filter((i) => {
                i.visible = false;
                return String(i.type) === 'actuator';
            }));
            config_list = config_list.concat(tmp.filter(i => String(i.type) === 'meta'));
        }
        const { t } = this.props;
        // console.log('attrs: ', dal);
        return (
            <div className="row detail-body">
                <div className="first-col">
                    <Configurations device={this.props.device} attrs={config_list} t={t}/>
                    <StaticAttributes device={this.props.device} attrs={attr_list}
                                      openStaticMap={this.openStaticMap} t={t}/>
                </div>
                <DyAttributeArea device={this.props.device} actuators={actuators} attrs={dal}
                                 openStaticMap={this.state.openStaticMap} t={t}/>
            </div>
        );
    }
}


class ViewDeviceImpl extends Component {
    constructor(props) {
        super(props);
        this.state = {
            show_modal: false,
        };
        this.setModal = this.setModal.bind(this);
        this.remove = this.remove.bind(this);
    }

    componentWillMount() {
        const device = this.props.devices[this.props.device_id];
        if (device === undefined) return; // not ready

        for (const i in device.attrs) {
            for (const j in device.attrs[i]) {
                if (device.attrs[i][j].type !== 'meta') {
                    MeasureActions.fetchMeasure.defer(device, device.attrs[i][j].label, 10);
                }
            }
        }
    }

    remove(e) {
        // This should be on DeviceUserActions -
        // this is not good, but will have to make do because of z-index on the action header
        const { t } = this.props;
        e.preventDefault();
        DeviceActions.triggerRemoval({ id: this.props.device_id }, (response) => {
            toaster.success(t('devices:alerts.remove'));
            hashHistory.push('/device/list');
        });
    }

    setModal(status) {
        this.setState({ show_modal: status });
    }


    render() {
        let device;

        if (this.props.devices !== undefined) {
            if (this.props.devices.hasOwnProperty(this.props.device_id)) {
                device = this.props.devices[this.props.device_id];
            }
        }

        if (device === undefined) {
            return (<Loading/>);
        }
        const { t } = this.props;
        return (
            <div className="full-height bg-light-gray">
                <NewPageHeader title={t('devices:title')} subtitle={t('devices:subtitle')}
                               icon="device">
                    <div className="box-sh">
                        <DeviceUserActions devices={this.props.devices} deviceid={device.id}
                                           setModal={this.setModal} t={t}/>
                    </div>
                </NewPageHeader>
                <DeviceHeader device={device} t={t}/>
                <DeviceDetail deviceid={device.id} device={device} t={t}/>
                {this.state.show_modal ?
                    <RemoveModal name={t('devices:device')} remove={this.remove}
                                 openModal={this.setModal}/> :
                    <div/>}
            </div>
        );
    }
}

// TODO: this is an awful quick hack - this should be better scoped.
let device_detail_socket = null;

class ViewDeviceComponent extends Component {
    constructor(props) {
        super(props);
    }

    componentWillMount() {
        DeviceActions.fetchSingle.defer(this.props.params.device);
    }

    componentDidMount() {
        // Realtime
        const socketio = require('socket.io-client');

        const target = `${window.location.protocol}//${window.location.host}`;
        const token_url = `${target}/stream/socketio`;

        function getWsToken() {
            util._runFetch(token_url)
                .then((reply) => {
                    init(reply.token);
                })
                .catch((error) => {
                    // console.log('Failed!', error);
                });
        }

        function init(token) {
            device_detail_socket = socketio(target, {
                query: `token=${token}`,
                transports: ['polling']
            });

            device_detail_socket.on('all', (data) => {
                MeasureActions.appendMeasures(data);
            });

            // console.log('socket error', data);
            device_detail_socket.on('error', (data) => {
                if (device_detail_socket) device_detail_socket.close();
                // getWsToken();
            });
        }

        getWsToken();
    }

    componentWillUnmount() {
        if (device_detail_socket) device_detail_socket.close();
    }

    render() {
        return (
            <div className="full-width full-height">
                <AltContainer store={DeviceStore}>
                    <ViewDeviceImpl device_id={this.props.params.device} t={this.props.t}/>
                </AltContainer>
            </div>
        );
    }
}

const ViewDevice = withNamespaces()(ViewDeviceComponent);
export { ViewDevice };
