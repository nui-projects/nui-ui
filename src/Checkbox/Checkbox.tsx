import { Component, ReactNode } from 'react';
import { ColorToRgba, ctcMethod, gcsMethod } from '../utils';

import { Check } from 'react-feather';

import './Checkbox.css';

type sizes    = 'sm' | 'md' | 'lg' | undefined;
type variants = 'ghost' | 'border' | 'shadow' | undefined;
type colors   = 'black' | 'white' | 'google-material-themed' | undefined;

interface CheckboxProps {
    labelComponent     : ReactNode
    clickBehaviour     : 'all' | 'chkbox'
    checkedByDefault  ?: boolean
    onChecked         ?: ( value: boolean ) => void

    disabled          ?: boolean
    rounded           ?: sizes | undefined
    color             ?: colors
    variant           ?: variants
    shadow            ?: boolean

    transitionDuration?: string | undefined

    className         ?: string | undefined
    style             ?: React.CSSProperties | undefined
}

const dummy_checkbox_props: CheckboxProps = {
    labelComponent  : undefined,
    clickBehaviour  : 'all',

    checkedByDefault: false,
    onChecked       : ( ) => {},

    disabled        : false,
    rounded         : 'md',
    color           : 'black',
    variant         : 'shadow',
    shadow          : false,

    transitionDuration: ''
}

export class Checkbox extends Component<CheckboxProps> {
    state = {
        checkedStatus: this.props.checkedByDefault,
        isHovered    : false,
    }

    constructor(props: CheckboxProps) {
        super(props);
    }

    ToggleCheckBox = ( ) => 
    {
        const value = !this.state.checkedStatus;
        this.setState({
            checkedStatus: value
        });

        if ( typeof this.props.onChecked == 'function' ) return (this.props.onChecked as ( arg: boolean ) => void)(value);
    }
    
    render() {
        const CheckboxSizeGCS = gcsMethod('size', this.props);
        const CheckboxSize    = {
            x: (CheckboxSizeGCS as [ 0, 0 ])[0],
            y: (CheckboxSizeGCS as [ 0, 0 ])[1]
        };

        const CheckboxRoundedGCS = gcsMethod('rounded', this.props);
        const CheckboxRounded    = CheckboxRoundedGCS as number;

        const CheckboxAnimationTransition : string   = this.props['transitionDuration'] || 'all 196ms ease';
        const pickedColorAttribute      : string[] = (gcsMethod('color', this.props) as string[]);
        const pickedVariantAttribute    : string   = gcsMethod('variant', this.props) as string;

        const convertedColorToSupportGhostVariant = ColorToRgba(pickedColorAttribute[1], 0.1);
        const CheckboxStylingVariant      : React.CSSProperties = pickedVariantAttribute == 'ghost' ? {
            backgroundColor: convertedColorToSupportGhostVariant,
            color          : pickedColorAttribute[1],
        } : pickedVariantAttribute == 'border' ? {
            border         : `2px solid ${pickedColorAttribute[1]}`,
            backgroundColor: 'transparent',
            color          : pickedColorAttribute[1],
        } : {
            border         : `none`,
            backgroundColor: pickedColorAttribute[0],
            color          : pickedColorAttribute[1],
        };

        const CheckboxStylingDim      : React.CSSProperties = {
            minHeight     : `${CheckboxSize.x * 4}px`,
            minWidth      : `${CheckboxSize.x * 4}px`,
        }

        const defaultCheckboxStyling      : React.CSSProperties = {
            transition  : `${CheckboxAnimationTransition}`,
            borderRadius: `${CheckboxRounded}px`,
            outline     : 'none',
            cursor      : this.props.disabled == undefined || this.props.disabled == false ? 'pointer' : this.props.disabled == true ? 'not-allowed' : 'default',

            justifyContent: 'center',
            alignItems    : 'center',

            display       : 'flex',

            ...CheckboxStylingVariant,  
            ...CheckboxStylingDim          
        }

        const hoveredCheckboxStyling : React.CSSProperties = {
            ...defaultCheckboxStyling,

            backgroundColor: pickedColorAttribute[1],
            color          : pickedColorAttribute[0],
        }

        const props: {
            className: string,
            style    : React.CSSProperties,
        } = Object.entries(this.props)
        .filter(([key]) => !(key in dummy_checkbox_props))
        .reduce((acc, [key, value]) => {
            (acc as { [key: string]: ReactNode | ((value: boolean) => void) | React.CSSProperties })[key] = value;
            return acc;
        }, {}) as {
            className: string,
            style    : React.CSSProperties,
        };

        return (
            <div 
                { ...props }

                aria-disabled={this.props.disabled}
                onClick={!this.props.disabled && this.props.clickBehaviour == 'all' ? this.ToggleCheckBox : () => {}} 
                className={ctcMethod('nui-ui select-none nui-ui-checkbox-container items-start inline-flex gap-2 text-white nui-ui-chkbox-container', props.className)}
                style={!this.props.disabled ? {
                    ...props.style,
                    cursor: this.props.clickBehaviour == 'all' ? 'pointer' : 'default'
                } : {
                    opacity: 0.5,
                    cursor : 'not-allowed',
                }}
            >
                <span  
                    onMouseEnter={() => { if(this.props.disabled) return; this.setState({ isHovered: true  }) }}
                    onMouseLeave={() => { if(this.props.disabled) return; this.setState({ isHovered: false }) }}
                    onClick={!this.props.disabled && this.props.clickBehaviour == 'chkbox' ? this.ToggleCheckBox : () => {}} 
                    style={this.state.isHovered ? hoveredCheckboxStyling : defaultCheckboxStyling}
                    className='relative'
                >
                    <Check className='stroke-0 opacity-100 transform ease-in-out scale-0' strokeWidth={0} width={`${CheckboxSize.x * 3}px`} height={`${CheckboxSize.x * 3}px`} style={{
                        transition      : CheckboxAnimationTransition,
                        transform       : !this.state.checkedStatus ? 'rotate(32deg) translateY(12px) scale(0)' : 'rotate(0deg) translateY(0) scale(1)',
                        strokeLinecap   : 'round',
                        strokeWidth     : 3,
                        filter          : this.state.checkedStatus ? 'blur(0)' : 'blur(8px)',
                        strokeDashoffset: this.state.checkedStatus ? 500 : 0,
                        opacity         : this.state.checkedStatus ? 1 : 0
                    }}/>
                </span>
                { this.props.labelComponent }
            </div>
        );
    }
}
