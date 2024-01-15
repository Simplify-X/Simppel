// @ts-nocheck
import { isValidElement, cloneElement } from "react";
import { Controller } from "react-hook-form";
import clsx from "clsx";
import { makeStyles } from "@material-ui/core/styles";
import ErrorRoundedIcon from "@mui/icons-material/ErrorRounded";
import SnackbarContent from "@mui/material/SnackbarContent";

const useStyles = makeStyles((theme) => ({
    root: {
        backgroundColor: "transparent",
        color: "#EF4444",
        minWidth: 0,
        maxWidth: "100%",
        padding: 0,
        boxShadow: "none",
        marginTop: theme.spacing(0),
        marginBottom: theme.spacing(0.75),
        fontWeight: 500,
        letterSpacing: 0,
    },
    message: {
        display: "flex",
        alignItems: "flex-start",
        textAlign: "left",
        fontSize: ".875rem",
        lineHeight: "21px",
        padding: 0,
    },
    icon: {
        fontSize: 22,
        color: "#EF4444",
    },
    iconVariant: {
        marginRight: theme.spacing(0.4),
    },
}));

function getFieldValue(args) {
    if (args[1] !== undefined && !isValidElement(args[1])) {
        return args[1];
    }

    if (args[0] !== undefined) {
        return args[0].target?.value ?? args[0].target?.checked ?? args[0];
    }
}

function FormFieldError({ name, errorMessage, errors, errorClassName, ...props }) {
    const classes = useStyles();

    return (
        <SnackbarContent
            classes={{
                root: classes.root,
                message: classes.message,
            }}
            {...(errorClassName && { className: errorClassName })}
            message={
                <span className={classes.message}>
                    <ErrorRoundedIcon className={clsx(classes.icon, classes.iconVariant)} />
                    {errorMessage}
                </span>
            }
            {...props}
        />
    );
}

function FormField({
    as: Component,
    name,
    control,
    errors,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    type,
    defaultValue,
    errorClassName,
    onChange,
    ...props
}) {
    function handleFocus() {
        const selector = `[name=${name}]`;
        let errorElement = document.querySelector(selector);

        if (errorElement === null) {
            errorElement = document.getElementById(name);
        }

        if (errorElement) {
            if (errorElement.type === "hidden") {
                errorElement = errorElement.parentElement;
            }

            errorElement.scrollIntoView({
                behavior: "smooth",
                block: "center",
            });
        }
    }

    const errorMessage = errors[name]?.message;;

    return (
        <>
            {control && errors ? (
                <>
                    <span
                        style={name.startsWith("wishOrganisations-") ? { display: "flex" } : null}
                    >
                        <Controller
                            control={control}
                            name={name}
                            render={({ onChange: onRHFChange, onBlur: onRHFBlur, value, ref }) =>
                                isValidElement(Component) ? (
                                    cloneElement(Component, {
                                        onChange: (...args) =>
                                            onChange
                                                ? onRHFChange(onChange(...args))
                                                : onRHFChange(getFieldValue(args)),
                                        onBlur: onRHFBlur,
                                        checked: value,
                                        value,
                                        type,
                                        error: Boolean(errors[name]),
                                        ...props,
                                        inputref: ref,
                                    })
                                ) : (
                                    <Component
                                        onChange={(...args) => {
                                            return onChange
                                                ? onRHFChange(onChange(...args))
                                                : onRHFChange(getFieldValue(args));
                                        }}
                                        onBlur={onRHFBlur}
                                        checked={value}
                                        value={value}
                                        inputref={ref}
                                        error={Boolean(errors[name])}
                                        {...props}
                                    />
                                )
                            }
                            {...(defaultValue ? { defaultValue } : {})}
                            onFocus={handleFocus}
                        />
                    </span>

                    {name !== "organisationType" && errors[name] && (
                        <FormFieldError
                            name={name}
                            errors={errors}
                            errorMessage={errorMessage}
                            errorClassName={errorClassName}
                        />
                    )}
                </>
            ) : (
                <Component
                    name={name}
                    {...(defaultValue ? { defaultValue } : {})}
                    {...(onChange ? { onChange } : {})}
                    {...props}
                    onFocus={handleFocus}
                />
            )}
        </>
    );
}

export { FormFieldError, FormField };
export default FormField;
