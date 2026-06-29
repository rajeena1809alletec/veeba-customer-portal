import React, { useMemo, useState } from 'react';
import Icon from '../../../components/AppIcon';

const CustomersTable = ({ customers = [], onViewDetails }) => {
  const [sortConfig, setSortConfig] = useState({
    key: 'name',
    direction: 'asc',
  });

  const handleSort = (key) => {
    setSortConfig((prev) => ({
      key,
      direction:
        prev?.key === key && prev?.direction === 'asc' ? 'desc' : 'asc',
    }));
  };

  const formatCurrency = (amount) => {
    const value = Number(amount || 0);
    return `₹${value.toLocaleString('en-IN', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`;
  };

  const sortedCustomers = useMemo(() => {
    const data = [...customers];

    return data.sort((a, b) => {
      const { key, direction } = sortConfig;
      const multiplier = direction === 'asc' ? 1 : -1;

      if (['creditLimit', 'outstanding', 'overdueAmount'].includes(key)) {
        return ((a?.[key] || 0) - (b?.[key] || 0)) * multiplier;
      }

      return (a?.[key] || '').toString().localeCompare(
        (b?.[key] || '').toString(),
        undefined,
        { numeric: true, sensitivity: 'base' }
      ) * multiplier;
    });
  }, [customers, sortConfig]);

  const SortIcon = ({ columnKey }) => {
    if (sortConfig.key !== columnKey) {
      return <Icon name="ChevronsUpDown" size={14} className="ml-1 text-muted-foreground" />;
    }

    return sortConfig.direction === 'asc' ? (
      <Icon name="ChevronUp" size={14} className="ml-1 text-primary" />
    ) : (
      <Icon name="ChevronDown" size={14} className="ml-1 text-primary" />
    );
  };

  return (
    <>
      {/* <div className="hidden xl:block overflow-x-auto rounded-lg border border-border bg-card"> */}
      <div className="overflow-x-auto rounded-lg border border-border bg-card">
        <table className="w-full text-sm">
          <thead className="bg-muted/50 border-b border-border">
            <tr>
              <th
                className="px-4 py-3 text-left font-semibold text-foreground cursor-pointer"
                onClick={() => handleSort('code')}
              >
                <div className="flex items-center">
                  Code
                  <SortIcon columnKey="code" />
                </div>
              </th>

              <th
                className="px-4 py-3 text-left font-semibold text-foreground cursor-pointer"
                onClick={() => handleSort('name')}
              >
                <div className="flex items-center">
                  Name
                  <SortIcon columnKey="name" />
                </div>
              </th>

              <th
                className="px-4 py-3 text-left font-semibold text-foreground cursor-pointer"
                onClick={() => handleSort('city')}
              >
                <div className="flex items-center">
                  City
                  <SortIcon columnKey="city" />
                </div>
              </th>

              <th
                className="px-4 py-3 text-left font-semibold text-foreground cursor-pointer"
                onClick={() => handleSort('state')}
              >
                <div className="flex items-center">
                  State
                  <SortIcon columnKey="state" />
                </div>
              </th>

              <th className="px-4 py-3 text-left font-semibold text-foreground">Payment Term Code</th>

              <th
                className="px-4 py-3 text-right font-semibold text-foreground cursor-pointer"
                onClick={() => handleSort('creditLimit')}
              >
                <div className="flex items-center justify-end">
                  Credit Limit
                  <SortIcon columnKey="creditLimit" />
                </div>
              </th>

              <th
                className="px-4 py-3 text-right font-semibold text-foreground cursor-pointer"
                onClick={() => handleSort('outstanding')}
              >
                <div className="flex items-center justify-end">
                  Outstanding
                  <SortIcon columnKey="outstanding" />
                </div>
              </th>

              <th
                className="px-4 py-3 text-right font-semibold text-foreground cursor-pointer"
                onClick={() => handleSort('overdueAmount')}
              >
                <div className="flex items-center justify-end">
                  Overdue
                  <SortIcon columnKey="overdueAmount" />
                </div>
              </th>

              {/* <th
                className="px-4 py-3 text-left font-semibold text-foreground cursor-pointer"
                onClick={() => handleSort('salespersonCode')}
              >
                <div className="flex items-center">
                  Salesperson Code
                  <SortIcon columnKey="salespersonCode" />
                </div>
              </th> */}

              <th
                className="px-4 py-3 text-left font-semibold text-foreground cursor-pointer"
                onClick={() => handleSort('salespersonName')}
              >
                <div className="flex items-center">
                  Salesperson Name
                  <SortIcon columnKey="salespersonName" />
                </div>
              </th>

              <th
                className="px-4 py-3 text-left font-semibold text-foreground cursor-pointer"
                onClick={() => handleSort('salespersonLevel')}
              >
                <div className="flex items-center">
                  Salesperson Level
                  <SortIcon columnKey="salespersonLevel" />
                </div>
              </th>

              <th
                className="px-4 py-3 text-left font-semibold text-foreground cursor-pointer"
                onClick={() => handleSort('nsmName')}
              >
                <div className="flex items-center">
                  NSM Name
                  <SortIcon columnKey="nsmName" />
                </div>
              </th>

              <th
                className="px-4 py-3 text-left font-semibold text-foreground cursor-pointer"
                onClick={() => handleSort('rsmName')}
              >
                <div className="flex items-center">
                  RSM Name
                  <SortIcon columnKey="rsmName" />
                </div>
              </th>

              <th
                className="px-4 py-3 text-left font-semibold text-foreground cursor-pointer"
                onClick={() => handleSort('zsmName')}
              >
                <div className="flex items-center">
                  ZSM Name
                  <SortIcon columnKey="zsmName" />
                </div>
              </th>

              <th
                className="px-4 py-3 text-left font-semibold text-foreground cursor-pointer"
                onClick={() => handleSort('asmName')}
              >
                <div className="flex items-center">
                  ASM Name
                  <SortIcon columnKey="asmName" />
                </div>
              </th>

              <th
                className="px-4 py-3 text-left font-semibold text-foreground cursor-pointer"
                onClick={() => handleSort('asoName')}
              >
                <div className="flex items-center">
                  ASO Name
                  <SortIcon columnKey="asoName" />
                </div>
              </th>

              <th
                className="px-4 py-3 text-left font-semibold text-foreground cursor-pointer"
                onClick={() => handleSort('vpName')}
              >
                <div className="flex items-center">
                  VP Name
                  <SortIcon columnKey="vpName" />
                </div>
              </th>
              <th className="px-4 py-3 text-left font-semibold text-foreground">Contact Name</th>
              <th className="px-4 py-3 text-left font-semibold text-foreground">E-mail ID</th>

              <th className="px-4 py-3 text-center font-semibold text-foreground">Actions</th>
            </tr>
          </thead>

          <tbody>
            {sortedCustomers.length === 0 ? (
              <tr>
                <td colSpan={19} className="px-4 py-8 text-center text-muted-foreground">
                  No customer records found.
                </td>
              </tr>
            ) : (
              sortedCustomers.map((customer) => (
                <tr key={customer.id} className="border-b border-border last:border-b-0 hover:bg-muted/30">
                  <td className="px-4 py-3">
                    <button
                      type="button"
                      onClick={() => onViewDetails(customer)}
                      className="text-primary hover:underline font-medium text-left"
                    >
                      {customer.code || '-'}
                    </button>
                  </td>
                  <td className="px-4 py-3 text-foreground font-medium">{customer.name || '-'}</td>
                  <td className="px-4 py-3 text-muted-foreground">{customer.city || '-'}</td>
                  <td className="px-4 py-3 text-muted-foreground">{customer.state || '-'}</td>
                  <td className="px-4 py-3 text-muted-foreground">{customer.paymentTermCode || '-'}</td>
                  <td className="px-4 py-3 text-right text-foreground">{formatCurrency(customer.creditLimit)}</td>
                  <td className="px-4 py-3 text-right text-foreground">{formatCurrency(customer.outstanding)}</td>
                  <td className="px-4 py-3 text-right text-foreground">
                    {customer.overdueAmount != null ? formatCurrency(customer.overdueAmount) : '-'}
                  </td>
                  {/* <td className="px-4 py-3 text-muted-foreground">{customer.salespersonCode || '-'}</td> */}
                  <td className="px-4 py-3 text-muted-foreground">{customer.salespersonName || '-'}</td>
                  <td className="px-4 py-3 text-muted-foreground">{customer.salespersonLevel || '-'}</td>
                  <td className="px-4 py-3 text-muted-foreground">{customer.nsmName || '-'}</td>
                  <td className="px-4 py-3 text-muted-foreground">{customer.rsmName || '-'}</td>
                  <td className="px-4 py-3 text-muted-foreground">{customer.zsmName || '-'}</td>
                  <td className="px-4 py-3 text-muted-foreground">{customer.asmName || '-'}</td>
                  <td className="px-4 py-3 text-muted-foreground">{customer.asoName || '-'}</td>
                  <td className="px-4 py-3 text-muted-foreground">{customer.vpName || '-'}</td>
                  <td className="px-4 py-3 text-muted-foreground">{customer.contactName || '-'}</td>
                  <td className="px-4 py-3 text-muted-foreground">{customer.email || '-'}</td>
                  <td className="px-4 py-3 text-center">
                    <button
                      type="button"
                      onClick={() => onViewDetails(customer)}
                      className="inline-flex items-center gap-1 text-primary hover:underline"
                    >
                      <Icon name="Eye" size={16} />
                      View
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Mobile */}
      <div className="xl:hidden space-y-4">
        {sortedCustomers.length === 0 ? (
          <div className="rounded-lg border border-border bg-card p-6 text-center text-muted-foreground">
            No customer records found.
          </div>
        ) : (
          sortedCustomers.map((customer) => (
            <div key={customer.id} className="rounded-lg border border-border bg-card p-4 space-y-3">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h3 className="font-semibold text-foreground">{customer.name || '-'}</h3>
                  <button
                    type="button"
                    onClick={() => onViewDetails(customer)}
                    className="text-sm text-primary hover:underline text-left"
                  >
                    {customer.code || '-'}
                  </button>
                </div>

                <button
                  type="button"
                  onClick={() => onViewDetails(customer)}
                  className="inline-flex items-center gap-1 text-primary hover:underline text-sm"
                >
                  <Icon name="Eye" size={16} />
                  View
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
                <div>
                  <p className="text-muted-foreground">Contact Name</p>
                  <p className="text-foreground">{customer.contactName || '-'}</p>
                </div>

                <div>
                  <p className="text-muted-foreground">E-mail ID</p>
                  <p className="text-foreground break-all">{customer.email || '-'}</p>
                </div>

                <div>
                  <p className="text-muted-foreground">City</p>
                  <p className="text-foreground">{customer.city || '-'}</p>
                </div>

                <div>
                  <p className="text-muted-foreground">State</p>
                  <p className="text-foreground">{customer.state || '-'}</p>
                </div>

                <div>
                  <p className="text-muted-foreground">Payment Term Code</p>
                  <p className="text-foreground">{customer.paymentTermCode || '-'}</p>
                </div>

                <div>
                  <p className="text-muted-foreground">Salesperson Name</p>
                  <p className="text-foreground">{customer.salespersonName || '-'}</p>
                </div>
                {/* <div>
                  <p className="text-muted-foreground">Salesperson Code</p>
                  <p className="text-foreground">{customer.salespersonCode || '-'}</p>
                </div> */}

                <div>
                  <p className="text-muted-foreground">Salesperson Level</p>
                  <p className="text-foreground">{customer.salespersonLevel || '-'}</p>
                </div>

                <div>
                  <p className="text-muted-foreground">NSM Name</p>
                  <p className="text-foreground">{customer.nsmName || '-'}</p>
                </div>

                <div>
                  <p className="text-muted-foreground">RSM Name</p>
                  <p className="text-foreground">{customer.rsmName || '-'}</p>
                </div>

                <div>
                  <p className="text-muted-foreground">ZSM Name</p>
                  <p className="text-foreground">{customer.zsmName || '-'}</p>
                </div>

                <div>
                  <p className="text-muted-foreground">ASM Name</p>
                  <p className="text-foreground">{customer.asmName || '-'}</p>
                </div>

                <div>
                  <p className="text-muted-foreground">ASO Name</p>
                  <p className="text-foreground">{customer.asoName || '-'}</p>
                </div>

                <div>
                  <p className="text-muted-foreground">VP Name</p>
                  <p className="text-foreground">{customer.vpName || '-'}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Credit Limit</p>
                  <p className="text-foreground">{formatCurrency(customer.creditLimit)}</p>
                </div>

                <div>
                  <p className="text-muted-foreground">Outstanding</p>
                  <p className="text-foreground">{formatCurrency(customer.outstanding)}</p>
                </div>

                <div>
                  <p className="text-muted-foreground">Overdue</p>
                  <p className="text-foreground">
                    {customer.overdueAmount != null ? formatCurrency(customer.overdueAmount) : '-'}
                  </p>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </>
  );
};

export default CustomersTable;