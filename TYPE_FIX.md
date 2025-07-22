# TypeScript Type Fix for Email Components

## Issues Fixed

1. **Type Mismatch in EmailTemplate**
   - Fixed the return type of `mapEmailType` function to match the EmailTemplate interface
   - Updated default return values to ensure they always match the expected type

2. **Implementation Changes**
   - Modified `mapEmailType` to return the correct union type: 
     `'user_approved' | 'user_rejected' | 'timesheet_approved' | 'timesheet_rejected' | 'admin_approved' | 'timesheet_submitted'`
   - Changed default case to return 'timesheet_submitted' instead of dynamic values
   - Removed unnecessary type casting in the email processing functions

## Root Cause

The issue was caused by a type mismatch between the returned string from `mapEmailType` and the strict union type required by the `EmailTemplate` interface. The function was returning a generic string that TypeScript couldn't guarantee would match one of the allowed values in the union type.

## Files Modified

1. `src/app/pages/email-logs/email-logs.ts`
2. `src/app/components/email-widget/email-widget.component.ts`