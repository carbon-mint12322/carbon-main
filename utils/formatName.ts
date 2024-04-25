export function formatName(name : any) {
    return (name?.firstName || '') + 
          (name?.lastName ? ' ' + name.lastName : '')
}