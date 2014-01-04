require('./setup');
var createModels = require('./resources/models').createModels;
var GhostTrain = require('ghosttrain');
var expect = require('expect.js');

describe('Backbone Model', function () {
  describe('Model#save', function () {
    it('POST on new model and calls "success" callback', function (done) {
      var gt = new GhostTrain();
      var User = createModels(gt).User;
      var user = new User({
        name: 'Ragnarr Loðbrók',
        job: 'Viking'
      });

      gt.post('/users', function (req, res) {
        res.send(200, { message: 'Created!' });
      });

      user.save(null, {
        success: function (model, res, options) {
          expect(options.success).to.be.ok();
          expect(options.error).to.be.ok();
          expect(model).to.be.equal(user);
          expect(res.message).to.be.equal('Created!');
          done();
        }
      });
    });

    [201, 300, 404, 500].forEach(function (code) {
      it('POST on new model and calls "error" on non-200 response ('+code+')', function (done) {
        var gt = new GhostTrain();
        var User = createModels(gt).User;
        var user = new User({
          name: 'Ragnarr Loðbrók',
          job: 'Viking'
        });

        gt.post('/users', function (req, res) {
          res.send(code, { message: 'Failure!' });
        });

        user.save(null, {
          error: function (model, res, options) {
            expect(options.success).to.be.ok();
            expect(options.error).to.be.ok();
            expect(model).to.be.equal(user);
            expect(res.message).to.be.equal('Failure!');
            done();
          }
        });
      });

      it('PATCH when `patch: true` and sends only changed attrs', function (done) {
        var gt = new GhostTrain();
        var User = createModels(gt).User;
        var user = new User({
          name: 'Ragnarr Loðbrók'
        });

        gt.post('/users', function (req, res) { res.send(); });

        user.save(null, {
          success: update
        });

        function update () {
          user.set('job', 'viking');
          gt.patch('/users', function (req, res) {
            expect(req.body.job).to.be.equal('viking');
            expect(Object.keys(req.body)).to.have.length.equal(1);
            res.send('OK');
          });
        
          user.save(null, {
            patch: true,
            success: function (model, res, options) {
              expect(model).to.be.equal(user);
              expect(options.success).to.be.ok();
              expect(options.error).to.be.ok();
              expect(res).to.be.equal('OK');
              done();
            }
          });
        }
      });
    });

    it('PUT on updating an existing model and calls "success" callback', function (done) {
      var gt = new GhostTrain();
      var User = createModels(gt).User;
      var user = new User({
        name: 'Dominic Cifarelli',
        // Give it an id so Backbone thinks it's an update
        id: 12345
      });

      gt.put('/users/:id', function (req, res) {
        expect(req.params.id).to.be.equal('12345');
        res.send(200);
      });

      user.save(null, {
        success: function (model, res, options) {
          expect(model).to.be.equal(user);
          expect(options.success).to.be.ok();
          expect(options.error).to.be.ok();
          expect(res).to.be.equal('OK');
          done();
        }
      });
    });
  });

  describe('Model#fetch', function () {
    it('GET on existing model and calls "success" callback with model', function (done) {
      var gt = new GhostTrain();
      var User = createModels(gt).User;
      var user = new User({
        id: 12345
      });

      gt.get('/users/:id', function (req, res) {
        res.send(200, {
          name: 'Jesper Strömblad',
          job: 'shredding allday'
        });
      });

      user.fetch({
        success: function (model, res, options) {
          expect(model).to.be.equal(user);
          expect(options.success).to.be.ok();
          expect(options.error).to.be.ok();
          expect(res.name).to.be.equal('Jesper Strömblad');
          expect(res.job).to.be.equal('shredding allday');
          expect(user.get('name')).to.be.equal('Jesper Strömblad');
          expect(user.get('job')).to.be.equal('shredding allday');
          done();
        }
      });
    });
  });

  describe('Model#delete', function () {
    it('DELETE on removing a model and calls "success"', function (done) {
      var gt = new GhostTrain();
      var User = createModels(gt).User;
      var user = new User({
        name: 'Dominic Cifarelli',
        // Give it an id so Backbone thinks it's an update
        id: 12345
      });

      gt['delete']('/users/:id', function (req, res) {
        res.send(200);
      });

      user.destroy({
        success: function (model, res, options) {
          expect(model).to.be.equal(user);
          expect(options.success).to.be.ok();
          expect(options.error).to.be.ok();
          expect(res).to.be.equal('OK');
          done();
        }
      });
    });
  });
});

describe('Use $.Deferred if exists', function () {
  if (typeof document !== 'object') {
    it('Cannot use jQuery in this environment', function (done) {
      expect(true).to.be.ok();
      done();
    });
  } else {
    it('resolves promise with context and body on success', function (done) {
      var gt = new GhostTrain();
      var User = createModels(gt, $).User;
      var user = new User({
        name: 'Ragnarr Loðbrók',
        job: 'Viking'
      });

      gt.post('/users', function (req, res) {
        res.send({ message: 'yeahyuh' });
      });

      user.save().done(function (val) {
        expect(this).to.be.equal(user);
        expect(val.message).to.be.equal('yeahyuh');
        done();
      });
    });

    it('rejects promise with context and error on failure', function (done) {
      // Only run in browsers where $ works
      if (typeof document !== 'object') return done();
      var gt = new GhostTrain();
      var User = createModels(gt, $).User;
      var user = new User({
        name: 'Ragnarr Loðbrók',
        job: 'Viking'
      });

      var response = {};

      gt.post('/users', function (req, res) {
        res.send(404, 'womp womp womp');
      });

      user.save().fail(function (val) {
        expect(this).to.be.equal(user);
        expect(val).to.be.equal('womp womp womp');
        done();
      });
    });
  }
});
