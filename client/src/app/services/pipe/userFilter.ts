import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'userfilter',
    pure: false
})
export class UserFilterPipe implements PipeTransform {
    transform(items: ApiUserObject[], filter: any): ApiUserObject[] {
        if (!items || !filter) {
            return items;
        }
        // filter items array, items which match and return true will be
        // kept, false will be filtered out
        return items.filter(item => checkSubObject(item, filter));
    }
}

function checkSubObject(item, filter): Boolean {
    const keys = Object.keys(filter);
    let IsPresent = true;
    keys.forEach(key => {
        if (item[key] !== filter[key]) {
            IsPresent = false;
        }
    });
    return IsPresent;
}
