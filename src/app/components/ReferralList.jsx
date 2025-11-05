import { User, Mail, CheckCircle, XCircle, Clock, Award } from 'lucide-react';

export default function ReferralList({ referrals = [] }) {
  const getStatusConfig = (status) => {
    const normalizedStatus = status?.toLowerCase() || 'pending';
    
    switch (normalizedStatus) {
      case 'approved':
      case 'completed':
        return {
          icon: CheckCircle,
          label: 'Approved',
          bgColor: 'bg-green-50',
          textColor: 'text-green-700',
          borderColor: 'border-green-200',
          iconColor: 'text-green-600'
        };
      case 'rejected':
      case 'declined':
        return {
          icon: XCircle,
          label: 'Rejected',
          bgColor: 'bg-red-50',
          textColor: 'text-red-700',
          borderColor: 'border-red-200',
          iconColor: 'text-red-600'
        };
      case 'pending':
      default:
        return {
          icon: Clock,
          label: 'Pending',
          bgColor: 'bg-amber-50',
          textColor: 'text-amber-700',
          borderColor: 'border-amber-200',
          iconColor: 'text-amber-600'
        };
    }
  };

  if (!referrals.length) {
    return (
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8 sm:p-12">
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gray-100 rounded-full mb-4">
            <Award className="w-8 h-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-semibold text-[#010101] mb-2">
            No Referrals Yet
          </h3>
          <p className="text-gray-600 text-sm max-w-sm mx-auto">
            Your referrals will appear here once you start submitting them. Get started by submitting your first referral!
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 sm:p-8">
      <div className="mb-6">
        <h2 className="text-2xl font-semibold text-[#010101] mb-1">
          Your Referrals
        </h2>
        <p className="text-gray-600 text-sm">
          {referrals.length} {referrals.length === 1 ? 'referral' : 'referrals'} submitted
        </p>
      </div>

      <div className="space-y-3">
        {referrals.map((r) => {
          const statusConfig = getStatusConfig(r.status);
          const StatusIcon = statusConfig.icon;

          return (
            <div
              key={r._id || r.refereeEmail}
              className="bg-[#FAFAF7] border border-gray-200 rounded-xl p-4 sm:p-5 hover:shadow-md hover:-translate-y-0.5 transition-all duration-200"
            >
              <div className="flex items-start justify-between gap-4 mb-3">
                <div className="flex items-start gap-3 flex-1 min-w-0">
                  <div className="flex-shrink-0 w-10 h-10 bg-[#EDB508] rounded-lg flex items-center justify-center mt-0.5">
                    <User className="w-5 h-5 text-[#010101]" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-base font-semibold text-[#010101] truncate">
                      {r.refereeName}
                    </h3>
                    <div className="flex items-center gap-2 mt-1">
                      <Mail className="w-4 h-4 text-gray-400 flex-shrink-0" />
                      <span className="text-sm text-gray-600 truncate">
                        {r.refereeEmail}
                      </span>
                    </div>
                  </div>
                </div>

                <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border flex-shrink-0 ${statusConfig.bgColor} ${statusConfig.textColor} ${statusConfig.borderColor}`}>
                  <StatusIcon className={`w-4 h-4 ${statusConfig.iconColor}`} />
                  <span className="text-xs font-medium whitespace-nowrap">
                    {statusConfig.label}
                  </span>
                </div>
              </div>

              {r.rejectionReason && r.status?.toLowerCase() === 'rejected' && (
                <div className="mt-3 p-3 bg-red-50 border border-red-200 rounded-lg">
                  <p className="text-xs text-red-700">
                    <span className="font-semibold">Reason: </span>
                    {r.rejectionReason}
                  </p>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}