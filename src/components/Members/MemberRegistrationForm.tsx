import React, { useState } from 'react';
import { useApp } from '../../contexts/AppContext';
import { Member, Group } from '../../types';

interface MemberRegistrationFormProps {
  onClose: () => void;
}

const MemberRegistrationForm: React.FC<MemberRegistrationFormProps> = ({ onClose }) => {
  const { members, setMembers, groups, setGroups } = useApp();
  const [registrationType, setRegistrationType] = useState<'individual' | 'group'>('individual');
  const [formData, setFormData] = useState({
    name: '',
    idNumber: '',
    phone: '',
    email: '',
    address: '',
    monthlyContribution: 1000,
    groupName: '',
    groupPurpose: '',
    groupLeader: '',
    groupMembers: [{ name: '', idNumber: '', phone: '', email: '', address: '', monthlyContribution: 1000 }]
  });

  const handleInputChange = (field: string, value: string | number) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleGroupMemberChange = (index: number, field: string, value: string | number) => {
    const newMembers = [...formData.groupMembers];
    newMembers[index] = { ...newMembers[index], [field]: value };
    setFormData(prev => ({
      ...prev,
      groupMembers: newMembers
    }));
  };

  const addGroupMember = () => {
    setFormData(prev => ({
      ...prev,
      groupMembers: [...prev.groupMembers, { name: '', idNumber: '', phone: '', email: '', address: '', monthlyContribution: 1000 }]
    }));
  };

  const removeGroupMember = (index: number) => {
    if (formData.groupMembers.length > 1) {
      const newMembers = formData.groupMembers.filter((_, i) => i !== index);
      setFormData(prev => ({
        ...prev,
        groupMembers: newMembers
      }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (registrationType === 'individual') {
      const newMember: Member = {
        id: `M${Date.now()}`,
        name: formData.name,
        idNumber: formData.idNumber,
        phone: formData.phone,
        email: formData.email,
        address: formData.address,
        type: 'individual',
        registrationDate: new Date(),
        monthlyContribution: formData.monthlyContribution,
        shareBalance: 0,
        status: 'active'
      };
      
      setMembers([...members, newMember]);
    } else {
      const groupId = `G${Date.now()}`;
      const newGroupMembers: Member[] = formData.groupMembers.map((member, index) => ({
        id: `M${Date.now()}_${index}`,
        name: member.name,
        idNumber: member.idNumber,
        phone: member.phone,
        email: member.email,
        address: member.address,
        type: 'group' as const,
        registrationDate: new Date(),
        monthlyContribution: member.monthlyContribution,
        shareBalance: 0,
        status: 'active' as const,
        groupId: groupId
      }));

      const newGroup: Group = {
        id: groupId,
        name: formData.groupName,
        purpose: formData.groupPurpose,
        leader: formData.groupLeader,
        registrationDate: new Date(),
        members: newGroupMembers,
        status: 'active'
      };

      setMembers([...members, ...newGroupMembers]);
      setGroups([...groups, newGroup]);
    }

    onClose();
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Registration Type */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Registration Type</label>
          <div className="flex space-x-4">
            <button
              type="button"
              onClick={() => setRegistrationType('individual')}
              className={`px-4 py-2 rounded-lg border-2 transition-colors ${
                registrationType === 'individual'
                  ? 'border-orange-600 bg-orange-50 text-orange-700'
                  : 'border-gray-300 hover:border-gray-400'
              }`}
            >
              Individual Member
            </button>
            <button
              type="button"
              onClick={() => setRegistrationType('group')}
              className={`px-4 py-2 rounded-lg border-2 transition-colors ${
                registrationType === 'group'
                  ? 'border-orange-600 bg-orange-50 text-orange-700'
                  : 'border-gray-300 hover:border-gray-400'
              }`}
            >
              Group Registration
            </button>
          </div>
        </div>

        {registrationType === 'individual' ? (
          // Individual Registration Form
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">ID Number</label>
                <input
                  type="text"
                  required
                  value={formData.idNumber}
                  onChange={(e) => handleInputChange('idNumber', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                <input
                  type="tel"
                  required
                  value={formData.phone}
                  onChange={(e) => handleInputChange('phone', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
              <textarea
                required
                value={formData.address}
                onChange={(e) => handleInputChange('address', e.target.value)}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Monthly Contribution (KSh)</label>
              <input
                type="number"
                required
                min="1000"
                value={formData.monthlyContribution}
                onChange={(e) => handleInputChange('monthlyContribution', parseInt(e.target.value))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
              />
              <p className="text-sm text-gray-500 mt-1">Minimum: KSh 1,000</p>
            </div>

            <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
              <h4 className="font-medium text-orange-800 mb-2">Registration Fee</h4>
              <p className="text-sm text-orange-700">Individual registration fee: KSh 2,000</p>
            </div>
          </div>
        ) : (
          // Group Registration Form
          <div className="space-y-6">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h4 className="font-medium text-blue-800 mb-2">Group Information</h4>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Group Name</label>
                  <input
                    type="text"
                    required
                    value={formData.groupName}
                    onChange={(e) => handleInputChange('groupName', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Group Purpose</label>
                  <textarea
                    required
                    value={formData.groupPurpose}
                    onChange={(e) => handleInputChange('groupPurpose', e.target.value)}
                    rows={2}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Group Leader</label>
                  <input
                    type="text"
                    required
                    value={formData.groupLeader}
                    onChange={(e) => handleInputChange('groupLeader', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-4">
                <h4 className="font-medium text-gray-800">Group Members</h4>
                <button
                  type="button"
                  onClick={addGroupMember}
                  className="text-sm bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded-lg transition-colors"
                >
                  Add Member
                </button>
              </div>
              
              {formData.groupMembers.map((member, index) => (
                <div key={index} className="bg-gray-50 border border-gray-200 rounded-lg p-4 mb-4">
                  <div className="flex items-center justify-between mb-4">
                    <h5 className="font-medium text-gray-700">Member {index + 1}</h5>
                    {formData.groupMembers.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeGroupMember(index)}
                        className="text-red-600 hover:text-red-700 text-sm"
                      >
                        Remove
                      </button>
                    )}
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                      <input
                        type="text"
                        required
                        value={member.name}
                        onChange={(e) => handleGroupMemberChange(index, 'name', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">ID Number</label>
                      <input
                        type="text"
                        required
                        value={member.idNumber}
                        onChange={(e) => handleGroupMemberChange(index, 'idNumber', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                      <input
                        type="tel"
                        required
                        value={member.phone}
                        onChange={(e) => handleGroupMemberChange(index, 'phone', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                      <input
                        type="email"
                        required
                        value={member.email}
                        onChange={(e) => handleGroupMemberChange(index, 'email', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                      />
                    </div>
                  </div>
                  
                  <div className="mt-4">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
                    <textarea
                      required
                      value={member.address}
                      onChange={(e) => handleGroupMemberChange(index, 'address', e.target.value)}
                      rows={2}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                    />
                  </div>
                  
                  <div className="mt-4">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Monthly Contribution (KSh)</label>
                    <input
                      type="number"
                      required
                      min="1000"
                      value={member.monthlyContribution}
                      onChange={(e) => handleGroupMemberChange(index, 'monthlyContribution', parseInt(e.target.value))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                    />
                    <p className="text-sm text-gray-500 mt-1">Minimum: KSh 1,000 (KSh 800 personal + KSh 200 group)</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
              <h4 className="font-medium text-orange-800 mb-2">Registration Fee</h4>
              <p className="text-sm text-orange-700">Group registration fee: KSh 5,000</p>
            </div>
          </div>
        )}

        {/* Submit Buttons */}
        <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-gray-600 hover:text-gray-800 font-medium"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="bg-orange-600 hover:bg-orange-700 text-white px-6 py-2 rounded-lg font-medium transition-colors"
          >
            Register {registrationType === 'individual' ? 'Member' : 'Group'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default MemberRegistrationForm;