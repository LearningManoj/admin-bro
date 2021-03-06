const path = require('path')

const AdminBro = require('../src/admin-bro')

describe('AdminBro', function () {
  beforeEach(function () {
    AdminBro.registeredAdapters = []
  })

  describe('#constructor', function () {
    it('sets default root path when no given', function () {
      expect(new AdminBro().options.rootPath).to.equal('/admin')
    })
  })

  describe('.registerAdapter', function () {
    beforeEach(function () {
      class Database extends AdminBro.BaseDatabase {}
      class Resource extends AdminBro.BaseResource {}
      this.DatabaseAdapter = { Database, Resource }
    })

    it('adds given adapter to list off all available adapters', function () {
      AdminBro.registerAdapter(this.DatabaseAdapter)
      expect(AdminBro.registeredAdapters).to.have.lengthOf(1)
    })

    it('throws an error when adapter is not full', function () {
      expect(() => {
        AdminBro.registerAdapter({ Resource: AdminBro.BaseResource })
      }).to.throw('Adapter has to have both Database and Resource')
    })

    it('throws an error when adapter has elements not being subclassed from base adapter', function () {
      expect(() => {
        AdminBro.registerAdapter({ Resource: {}, Database: {} })
      }).to.throw('Adapter elements has to be subclassess of AdminBro.BaseResource and AdminBro.BaseDatabase')
    })
  })

  describe('.require', function () {
    afterEach(function () {
      AdminBro.UserComponents = {}
    })
    context('file exists', function () {
      beforeEach(function () {
        this.result = AdminBro.require('./fixtures/example-component')
      })

      it('adds given file to a UserComponents object', function () {
        expect(Object.keys(AdminBro.UserComponents)).to.have.lengthOf(1)
      })

      it('returns uniq id', function () {
        expect(AdminBro.UserComponents[this.result]).not.to.be.undefined
        expect(this.result).to.be.a('string')
      })

      it('converts relative path to absolute path', function () {
        expect(
          AdminBro.UserComponents[this.result],
        ).to.equal(path.join(__dirname, 'fixtures/example-component'))
      })
    })

    it('throws an error when component doesn\t exist', function () {
      expect(() => {
        AdminBro.require('./fixtures/example-components')
      }).to.throw().property('name', 'ConfigurationError')
    })
  })
})
