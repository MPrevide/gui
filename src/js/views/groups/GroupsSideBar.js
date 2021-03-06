import React, { Component } from 'react';
import { translate, Trans } from 'react-i18next';
import PropTypes from 'prop-types';
import ability from 'Components/permissions/ability';
import GroupActions from '../../actions/GroupActions';
import GroupPermissionActions from '../../actions/GroupPermissionActions';
import SideBarRight from './SideBarRight';
import toaster from '../../comms/util/materialize';
import { RemoveModal } from '../../components/Modal';
import { InputCheckbox, InputText } from '../../components/DojotIn';

const groupHasSubject = (subject, groupPermissions) => {
    if (groupPermissions) {
        const singlePermission = groupPermissions.filter(n1 => subject === n1.subject);
        return (singlePermission.length > 0);
    }
    return false;
};

const groupHasPermission = (subject, action, groupPermissions) => {
    if (groupPermissions) {
        const singlePermission = groupPermissions.filter(n1 => subject === n1.subject);
        if (singlePermission[0] && singlePermission[0].actions && singlePermission[0].actions.length > 0) {
            return singlePermission[0].actions.filter(n1 => n1 === action).length > 0;
        }
    }
    return false;
};

function TableGroupsPermissions(params) {
    const {
        handleChangeCheckbox, groupPermissions, systemPermissions, cannotEdit,
    } = params;

    if (!systemPermissions) {
        return (<div />);
    }

    return (
        <div className="bodyForm">
            <table className="striped centered">
                <thead>
                    <tr>
                        <th><Trans i18nKey="form.table_label.feature" /></th>
                        <th>
                            <Trans i18nKey="form.table_label.viewer" />
                        </th>
                        <th><Trans i18nKey="form.table_label.modifier" /></th>
                    </tr>
                </thead>
                <tbody>
                    {systemPermissions
                        .map(item => (
                            <tr key={`${item.subject}`}>
                                <td>
                                    <Trans i18nKey={`form.feature.${item.subject}`} />
                                </td>
                                <td>
                                    {groupHasPermission(item.subject, 'viewer', systemPermissions) ? (
                                        <InputCheckbox
                                            label=""
                                            placeHolder=""
                                            name={`${item.subject}.viewer`}
                                            checked={groupHasPermission(item.subject, 'viewer', groupPermissions)}
                                            handleChangeCheckbox={handleChangeCheckbox}
                                            disabled={cannotEdit}
                                        />
                                    ) : <div />}
                                </td>
                                <td>
                                    {groupHasPermission(item.subject, 'modifier', systemPermissions) ? (
                                        <InputCheckbox
                                            label=""
                                            placeHolder=""
                                            name={`${item.subject}.modifier`}
                                            checked={groupHasPermission(item.subject, 'modifier', groupPermissions)}
                                            handleChangeCheckbox={handleChangeCheckbox}
                                            disabled={cannotEdit}
                                        />
) : <div />}
                                </td>
                            </tr>
                        ))}
                </tbody>
            </table>
        </div>
    );
}

function Form(params) {
    const {
        handleCharge,
        dataGroup,
        handleChangeCheckbox,
        groupPermissions,
        systemPermissions,
        cannotEdit,
    } = params;

    if (!dataGroup) {
        return (<div />);
    }

    return (
        <form action="#">
            <InputText
                label={<Trans i18nKey="form.input.groupname.label" />}
                name="name"
                maxLength={30}
                onChange={handleCharge}
                value={dataGroup.name ? dataGroup.name : ''}
                disabled={cannotEdit}
                errorMessage={<Trans i18nKey="form.input.groupname.error" />}
            />
            <InputText
                label={<Trans i18nKey="description.label" />}
                name="description"
                maxLength={254}
                onChange={handleCharge}
                disabled={cannotEdit}
                value={dataGroup.description ? dataGroup.description : ''}
            />
            <TableGroupsPermissions
                groupPermissions={groupPermissions}
                systemPermissions={systemPermissions}
                handleChangeCheckbox={handleChangeCheckbox}
                cannotEdit={cannotEdit}
            />
        </form>
    );
}

class GroupsSideBar extends Component {
    constructor(props) {
        super(props);

        this.state = {
            showDeleteModal: false,
            group: undefined,
            grouppermissions: undefined,
            systempermissions: undefined,
            edit: false,
        };

        this.handleInput = this.handleInput.bind(this);
        this.discard = this.discard.bind(this);
        this.save = this.save.bind(this);
        this.delete = this.delete.bind(this);
        this.handleModalDelete = this.handleModalDelete.bind(this);
        this.handleCheckBox = this.handleCheckBox.bind(this);
    }

    static getDerivedStateFromProps(nextProps, prevState) {
        if (nextProps.grouppermissions !== prevState.grouppermissions) {
            return {
                ...prevState,
                systempermissions: nextProps.systempermissions,
                grouppermissions: nextProps.grouppermissions,
                group: nextProps.group,
                edit: nextProps.edit,
            };
        }
        return null;
    }

    static checkAlphaNumber(string) {
        // will be change - regex doesnt should be here
        const regex = /^([ \u00c0-\u01ffa-zA-Z'\-])+$/;
        return !regex.test(string);
    }

    componentDidCatch(error, info) {
        console.log(error, info);
    }

    handleInput(e) {
        const { name, value } = e.target;
        this.setState(prevState => ({
            ...prevState,
            group: {
                ...prevState.group,
                [name]: value,
            },
        }));
    }

    handleCheckBox(e) {
        const { name } = e.target;
        const [subject, action] = name.split('.');
        const { grouppermissions } = this.state;
        // i dont like this block of code, i will improve
        if (groupHasSubject(subject, grouppermissions)) {
            const hasPermission = groupHasPermission(subject, action, grouppermissions);
            grouppermissions.forEach((item, index1) => {
                if (item.subject === subject) {
                    if (hasPermission) {
                        (item.actions).forEach((item2, index2) => {
                            if (item2 === action) {
                                grouppermissions[index1].actions[index2] = '';
                            }
                        });
                    } else {
                        if (!grouppermissions[index1].actions) {
                            grouppermissions[index1].actions = [];
                        }
                        grouppermissions[index1].actions.push(action);
                    }
                }
            });
        } else {
            grouppermissions.push({
                subject,
                actions: [action],
            });
        }
        this.setState({
            grouppermissions,
        });
    }

    hideSideBar() {
        const { handleHideSideBar } = this.props;
        handleHideSideBar();
    }

    showSideBar() {
        const { handleShowSideBar } = this.props;
        handleShowSideBar();
    }

    discard() {
        this.hideSideBar();
    }

    formDataValidate() {
        // will be change - validation dont should be in toaster
        const { group } = this.state;
        const { t } = this.props;
        if ((group.name).trim().length <= 0) {
            toaster.warning(t('alerts.empty_name'));
            return false;
        }

        if (GroupsSideBar.checkAlphaNumber(group.name)) {
            toaster.warning(t('alerts.invalid_name'));
            return false;
        }

        if ((group.description).trim().length <= 0) {
            toaster.warning(t('alerts.empty_desc'));
            return false;
        }
        return true;
    }

    save() {
        if (this.formDataValidate()) {
            const { group, grouppermissions, edit } = this.state;
            const err = null;
            const e = null;
            const { t } = this.props;
            GroupActions.triggerSave(
                group,
                (response) => {
                    GroupPermissionActions.triggerSaveGroupPermissions(
                        group.name ? group.name : response.name, grouppermissions, err, e,
                        () => {
                        }, (groupR) => {
                            console.log(groupR);
                        },
                    );
                    if (edit) {
                        toaster.success(t('alerts.group_modify'));
                    } else {
                        toaster.success(t('alerts.group_create'));
                    }
                    this.hideSideBar();
                },
                (groupR) => {
                    console.log(groupR);
                },
            );
            GroupActions.fetchGroups.defer();
        }
    }


    handleModalDelete(status) {
        this.setState(prevState => ({
            ...prevState,
            showDeleteModal: status,
        }));
    }


    delete() {
        const { group } = this.state;
        const { t } = this.props;
        GroupActions.triggerRemoval(
            group.id,
            () => {
                toaster.success(t('alerts.group_remove'));
                this.hideSideBar();
            },
            (groupR) => {
                console.log(groupR);
            },
        );

        this.handleModalDelete(false);
        this.hideSideBar();
    }

    render() {
        const {
            group, edit, showDeleteModal, grouppermissions, systempermissions,
        } = this.state;

        const { t } = this.props;

        const cannotEdit = !ability.can('modifier', 'permission');

        const buttonsFooter = [
            {
                label: <Trans i18nKey="discard.label" />,
                click: this.discard,
                type: 'default',
            },
        ];

        if (!cannotEdit) {
            buttonsFooter.push({
                label: <Trans i18nKey="save.label" />,
                click: this.save,
                type: 'primary',
            });
            if (edit) {
                buttonsFooter.push({
                    label: <Trans i18nKey="remove.label" />,
                    click: this.handleModalDelete,
                    type: 'secondary',
                });
            }
        }


        return (
            <div>
                <SideBarRight
                    title={edit ? t('groups:form.title.edit')
                        : t('groups:form.title.new')}
                    content={(
                        <Form
                            dataGroup={group}
                            groupPermissions={grouppermissions}
                            systemPermissions={systempermissions}
                            handleCharge={this.handleInput}
                            handleChangeCheckbox={this.handleCheckBox}
                            cannotEdit={cannotEdit}
                        />
                    )}
                    visible
                    buttonsFooter={buttonsFooter}
                />
                {showDeleteModal ? (
                    <RemoveModal
                        name="group"
                        remove={this.delete}
                        openModal={this.handleModalDelete}
                    />
) : <div />}
            </div>
        );
    }
}

GroupsSideBar.propTypes = {
    grouppermissions: PropTypes.arrayOf(PropTypes.object).isRequired,
    group: PropTypes.instanceOf(Object).isRequired,
    edit: PropTypes.bool,
    handleHideSideBar: PropTypes.func.isRequired,
    handleShowSideBar: PropTypes.func.isRequired,
    t: PropTypes.func.isRequired,
};

GroupsSideBar.defaultProps = {
    edit: false,
};
export default translate()(GroupsSideBar);
