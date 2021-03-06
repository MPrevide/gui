import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import Slide from 'react-reveal/Slide';
import { DojotCustomButton } from 'Components/DojotButton';
import SidebarButton from 'Components/SidebarButton';
import MaterialInput from 'Components/MaterialInput';
import { withNamespaces } from 'react-i18next';
import { FormActions } from '../../Actions';
import SidebarDelete from '../../../templates/TemplateList/Sidebar/SidebarDelete';

const SidebarDevice = ({
    showSidebarDevice,
    handleShowManageTemplate,
    handleShowDeviceAttrs,
    toogleSidebarFirmware,
    device,
    handleChangeName,
    save,
    update,
    remove,
    isNewDevice,
    isShowSidebarDelete,
    toogleSidebarDelete,
    t,
}) => {
    const {
        configValues, dynamicValues, staticValues, actuatorValues,
    } = device;
    const hasImageAvailable = true;
    const total = device.templates.length ? device.templates.length : 0;
    return (
        <Fragment>
            <Slide right when={showSidebarDevice} duration={300}>
                {
                    showSidebarDevice
                        ? (
                            <div className="-sidebar device-sidebar">
                                <div className="header">
                                    <div className="title">
                                        {isNewDevice ? `${t('text.new')} ${t('devices:device')}` : device.label}
                                    </div>
                                    <div className="icon">
                                        <img src="images/icons/chip-cyan.png" alt="device-icon" />
                                    </div>
                                </div>
                                <div className="body">
                                    <div className="title">
                                        {t('devices:device')}
                                    </div>

                                    <div className="device-name">
                                        <div className="label">
                                            {`1.  ${t('text.set')} ${t('text.a')} ${t('text.name')} `}
                                        </div>
                                        <div className="device-name-input">
                                            <MaterialInput
                                                name="name"
                                                maxLength={40}
                                                value={device.label}
                                                onChange={e => handleChangeName(e.target.value)}
                                            >
                                                {t('text.name')}
                                            </MaterialInput>
                                        </div>
                                    </div>

                                    <div className="device-templates">
                                        <div className="label">
                                            {`2.  ${t('add.label')} ${t('text.or')}  ${t('remove.label')} ${t('templates:title')} `}
                                        </div>
                                        <div className="template-list">
                                            <div
                                                className="add-template-button"
                                                onClick={handleShowManageTemplate}
                                                onKeyPress={handleShowManageTemplate}
                                                tabIndex="0"
                                                role="button"
                                            >
                                                +
                                            </div>
                                            <div className="list">
                                                <div className="template-bagde">
                                                    <div
                                                        className="total-attrs"
                                                    >
                                                        {total}
                                                    </div>
                                                    <div
                                                        className="template-name"
                                                    >
                                                        {t('devices:selected_templates')}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                    </div>

                                    <div className="device-attrs">
                                        <div className="label">
                                            {`3. ${t('devices:manage_attributes')}`}
                                        </div>
                                        <SidebarButton
                                            onClick={() => handleShowDeviceAttrs(configValues, t('text.configuration'))}
                                            icon="config_attrs"
                                            title={t('text.configuration')}
                                            disable={configValues.length === 0}
                                        />
                                        <SidebarButton
                                            onClick={() => handleShowDeviceAttrs(staticValues, t('text.static_values'))}
                                            icon="data_attrs"
                                            title={t('text.static_values')}
                                            disable={staticValues.length === 0}
                                        />
                                        <SidebarButton
                                            onClick={() => handleShowDeviceAttrs(dynamicValues, t('text.dynamic_attributes'))}
                                            icon="data_attrs"
                                            title={t('text.dynamic_attributes')}
                                            disable={dynamicValues.length === 0}
                                        />
                                        <SidebarButton
                                            onClick={() => handleShowDeviceAttrs(actuatorValues, t('text.actuators'))}
                                            icon="config_attrs"
                                            title={t('text.actuators')}
                                            disable={actuatorValues.length === 0}
                                        />
                                        {!hasImageAvailable
                                        ? (
                                            <SidebarButton
                                                onClick={() => toogleSidebarFirmware()}
                                                icon="firmware"
                                                text="Manage Firmware"
                                            />
                                        ) : null}

                                    </div>

                                </div>

                                <div className="footer">
                                    {
                                        isNewDevice ? (
                                            <Fragment>
                                                <DojotCustomButton
                                                    label={t('discard.label')}
                                                    onClick={() => {
                                                        FormActions.toggleSidebarDevice(false);
                                                    }}
                                                />
                                                <DojotCustomButton
                                                    label={t('save.label')}
                                                    type="primary"
                                                    onClick={save}
                                                />
                                            </Fragment>
                                        ) : (
                                            <Fragment>
                                                <DojotCustomButton
                                                    label={t('discard.label')}
                                                    onClick={() => {
                                                        FormActions.toggleSidebarDevice(false);
                                                    }}
                                                />
                                                <DojotCustomButton
                                                    label={t('remove.label')}
                                                    type="secondary"
                                                    onClick={() => toogleSidebarDelete()}
                                                />
                                                <DojotCustomButton
                                                    label={t('save.label')}
                                                    type="primary"
                                                    onClick={update}
                                                />
                                            </Fragment>
                                        )
                                    }
                                </div>
                            </div>
                        )
                        : <div />
                }
            </Slide>
            <SidebarDelete
                cancel={toogleSidebarDelete}
                confirm={remove}
                showSidebar={isShowSidebarDelete}
                message={t('qst_remove', { label: t('devices:device') })}
            />
        </Fragment>
    );
};

SidebarDevice.propTypes = {
    showSidebarDevice: PropTypes.bool,
    handleShowManageTemplate: PropTypes.func.isRequired,
    handleShowDeviceAttrs: PropTypes.func.isRequired,
    toogleSidebarFirmware: PropTypes.func.isRequired,
    device: PropTypes.shape({
        attrs: PropTypes.array,
        created: PropTypes.string,
        id: PropTypes.string,
        label: PropTypes.string,
        static_attrs: PropTypes.array,
        status: PropTypes.string,
        tags: PropTypes.array,
        templates: PropTypes.array,
        updated: PropTypes.string,
    }).isRequired,
    t: PropTypes.func.isRequired,
};

SidebarDevice.defaultProps = {
    showSidebarDevice: false,
};
export default withNamespaces()(SidebarDevice);
